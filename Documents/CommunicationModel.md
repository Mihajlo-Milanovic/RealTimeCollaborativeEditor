# Model komunikacije u realnom vremenu

**Projekat:** Real-Time Collaborative Editor (RTCE)
**Tema dokumenta:** model komunikacije sistema i komponenta zadužena za komunikaciju u realnom vremenu

---

## 1. Uvod

Ovaj dokument opisuje kako korisnici sistema RTCE komuniciraju u realnom vremenu: kako dva (ili više) korisnika mogu istovremeno da uređuju isti dokument, da vide kursore jedni drugih, da dele komentare i strukturu fajl-sistema - bez ručnog osvežavanja stranice.

Sistem je izgrađen od tri celine:

| Celina | Tehnologija | Uloga |
|---|---|---|
| Frontend | React + TypeScript, Next.js, Tiptap | Korisnički interfejs i editor |
| Komunikacioni server | Hocuspocus (Node.js), port 1236 | Centralna tačka real-time komunikacije |
| Backend | Node.js (Express) + MongoDB, port 5000 | REST API i trajno čuvanje podataka |

Real-time komunikacija počiva na tri tehnologije koje rade zajedno: **WebSocket** (transportni kanal), **Hocuspocus** (server koji upravlja konekcijama i dokumentima) i **Y.js** (biblioteka koja opisuje i spaja izmene dokumenta). Svaka od njih je objašnjena u nastavku, redom kojim se pojavljuje u toku komunikacije.

---

## 2. Arhitektura komunikacije - pregled

Na najvišem nivou, komunikacija u sistemu izgleda ovako:

```
   Klijent A (browser)                        Klijent B (browser)
   React + Tiptap + Y.js                      React + Tiptap + Y.js
           │                                          │
           │  WebSocket (ws://host:1236)              │  WebSocket
           └──────────────┐            ┌──────────────┘
                          ▼            ▼
                   ┌──────────────────────────┐
                   │    Hocuspocus server     │   ◄── centralna tačka
                   │  (Node.js, port 1236)    │       komunikacije
                   │                          │
                   │   Y.Doc po dokumentu     │
                   │  ┌─────────────────────┐ │
                   │  │ sadržaj dokumenta   │ │
                   │  │ komentari (Y.Map)   │ │
                   │  │ fajl-sistem (Y.Map) │ │
                   │  │ awareness (kursori) │ │
                   │  └─────────────────────┘ │
                   └───────────┬──────────────┘
                               │  HTTP (REST)
                               ▼
               ┌─────────────────────────────────┐
               │   Backend (Express) + MongoDB   │   ◄── trajno čuvanje
               │    GET/POST /files/:id/state    │
               └─────────────────────────────────┘
```

Ključna ideja: **svaka izmena bilo kog korisnika prvo stiže do Hocuspocus servera, a on je prosleđuje svim ostalim korisnicima koji rade na istom dokumentu.** Klijenti nikada ne komuniciraju direktno jedan sa drugim.

---

## 3. WebSocket komunikacija

### 3.1. Šta je WebSocket

WebSocket je protokol koji omogućava **trajnu, dvosmernu vezu** između browsera i servera. Kada se veza jednom uspostavi, obe strane mogu da šalju poruke u bilo kom trenutku - server ne mora da čeka da ga klijent nešto pita.

### 3.2. Zašto nije korišćen običan HTTP

HTTP funkcioniše po principu *zahtev → odgovor*: klijent pošalje zahtev, server odgovori, veza se zatvara. To je odlično za učitavanje stranica i REST API (i naš backend na portu 5000 upravo tako radi), ali je loše za real-time kolaboraciju iz dva razloga:

1. **Server ne može sam da javi klijentu da se nešto promenilo.** Kada korisnik A otkuca slovo, server bi morao da čeka da ga korisnik B "pita" da li ima novosti (tzv. *polling*), što unosi kašnjenje i nepotreban saobraćaj.
2. **Svaki zahtev nosi režijski trošak** (uspostavljanje veze, zaglavlja), što je preskupo ako se izmene dešavaju na svaki pritisak tastera.

WebSocket rešava oba problema: veza je stalno otvorena i server može da *gurne* (push) promenu klijentu istog trenutka kada je primi.

### 3.3. Kako se konekcija uspostavlja i zašto ostaje otvorena

1. Klijent pošalje običan HTTP zahtev sa posebnim zaglavljem `Upgrade: websocket` na adresu `ws://localhost:1236` (u produkciji `wss://` - ista veza, ali šifrovana).
2. Server prihvati "nadogradnju" i od tog trenutka ista TCP veza prestaje da bude HTTP - postaje otvoren dvosmerni kanal.
3. Veza ostaje otvorena dokle god korisnik drži dokument otvoren. Kroz nju u oba smera teku male binarne poruke (Y.js update-i, opisani u poglavlju 5).

U našem projektu, frontend otvara **jednu** WebSocket konekciju po korisniku (komponenta `HocuspocusProviderWebsocketComponent` u `frontend/src/app/editor/page.tsx`), a kroz tu jednu vezu se multipleksira više "soba" - više dokumenata (komponenta `HocuspocusRoom`). Time se izbegava otvaranje nove veze za svaki dokument.

---

## 4. Hocuspocus server

### 4.1. Šta je Hocuspocus

Hocuspocus je Node.js server specijalizovan za kolaborativno uređivanje. Radi **iznad WebSocket-a**: prihvata WebSocket konekcije i zna kako da tumači Y.js poruke koje kroz njih stižu. U našem projektu se pokreće u `frontend/src/server/websocket.ts` i sluša na portu **1236** (startuje se zajedno sa Next.js serverom u `frontend/src/index.ts`).

### 4.2. Kako prihvata konekcije i održava sesije dokumenata

Svaki dokument u sistemu ima svoje **ime sobe** (kod nas je to ID fajla iz baze). Kada se klijent poveže i zatraži sobu:

1. Hocuspocus proveri da li već drži taj dokument u memoriji.
2. Ako ne drži - kreira novi `Y.Doc` i pozove naš `onLoadDocument` hook, koji sa backenda povuče poslednje sačuvano stanje (`GET /files/:id/state`) i primeni ga na dokument.
3. Klijent se "pretplati" na tu sobu i odmah dobije kompletno trenutno stanje.

Za svaku sobu Hocuspocus vodi evidenciju **ko je sve trenutno povezan**. Kada poslednji korisnik zatvori dokument, server sačuva stanje na backend (`onStoreDocument` hook → `POST /files/:id/state` → MongoDB polje `yDocState`) i oslobodi memoriju. Čuvanje se, radi efikasnosti, ne radi na svaku izmenu, već odloženo (debounce 5 sekundi, najkasnije na 30 sekundi).

### 4.3. Kako prosleđuje promene

Kada od jednog klijenta stigne izmena (Y.js update), Hocuspocus je:

1. primeni na svoj primerak dokumenta u memoriji,
2. prosledi **svim ostalim klijentima** povezanim na istu sobu.

Klijent koji je izmenu poslao ne dobija je nazad - on je već ima. Upravo zbog ovoga je Hocuspocus **centralna tačka komunikacije**: sve poruke između korisnika prolaze kroz njega.

### 4.4. Šta se sve sinhronizuje kroz Hocuspocus u ovom projektu

Kroz isti mehanizam, u našem sistemu se sinhronizuju **četiri vrste podataka**:

| Podatak | Struktura | Soba |
|---|---|---|
| Sadržaj dokumenta (tekst) | Y.js XML fragment (Tiptap) | ID fajla |
| Komentari na dokument | `Y.Map` "comments" | ID fajla |
| Struktura fajl-sistema (fajlovi/folderi) | `Y.Map` "fileSystem" | ID organizacije ili korisnika |
| Kursori i prisutni korisnici | *awareness* protokol | ID fajla |

*Awareness* je poseban, "prolazni" kanal: podaci o kursorima i prisutnim korisnicima se ne čuvaju u dokumentu niti u bazi - postoje samo dok je korisnik povezan. Zato lista aktivnih korisnika i tuđi kursori nestaju čim se korisnik diskonektuje.

---

## 5. Y.js model sinhronizacije

### 5.1. Šta je Y.Doc i šta su shared strukture

**Y.Doc** je kontejner - "živi dokument" koji postoji istovremeno na svakom klijentu i na Hocuspocus serveru. Unutar njega žive **shared (deljene) strukture**: tipovi podataka koji izgledaju kao obični (mapa, niz, tekst), ali imaju posebnu osobinu - svaku promenu nad njima Y.js automatski pretvori u poruku koja se može poslati drugima.

U projektu koristimo:

- **XML fragment** - Tiptap u njemu drži sadržaj teksta (pasusi, naslovi, liste…),
- **`Y.Map`** - mapa ključ→vrednost; koristimo je za fajl-sistem (`parentId → lista dece`) i za komentare (`fileId → lista komentara`).

### 5.2. Kako se promene zapisuju

Kada korisnik otkuca slovo, Y.js **ne šalje ceo dokument**. Umesto toga generiše **update** - malu binarnu poruku koja opisuje samo *šta se promenilo* ("na poziciju X ubačeno slovo M"). Update je obično reda veličine nekoliko desetina bajtova, pa je slanje na svaki pritisak tastera jeftino.

Svaki klijent koji primi update primeni ga na svoj primerak Y.Doc-a, i njegov editor se automatski osveži (Y.js obaveštava Tiptap, odnosno naše `observe` pretplate za mape).

### 5.3. Kako se rešavaju konflikti

Šta ako dva korisnika **istovremeno** izmene isto mesto u dokumentu? Y.js je implementacija tzv. **CRDT** struktura (*Conflict-free Replicated Data Type* - tip podataka koji se može replicirati bez konflikata). Bez ulaženja u matematiku, ideja je sledeća:

- svaki umetnuti karakter dobija **jedinstveni identitet** (koji korisnik ga je uneo i u kom odnosu prema susednim karakterima),
- zahvaljujući tome, dva update-a se uvek mogu **spojiti deterministički** - svejedno kojim redosledom stignu, svi klijenti izračunaju **identičan rezultat**,
- ništa se ne gubi i niko ne mora da "pobedi": ako oba korisnika ukucaju reč na isto mesto, obe reči će postojati u dokumentu, istim redosledom kod svih.

Zato ne postoji zaključavanje dokumenta, ne postoji "poslednji upis pobeđuje" i ne postoji dijalog "verzije su u konfliktu, izaberite jednu" - konflikt kao pojam je rešen na nivou strukture podataka.

---

## 6. Tok komunikacije između klijenata - korak po korak

Scenario: korisnik A i korisnik B uređuju isti dokument.

1. **Korisnik A otvara dokument.** U aplikaciji klikne na fajl u eksploreru; frontend zapamti ID izabranog fajla.
2. **Klijent uspostavlja WebSocket konekciju.** `HocuspocusProviderWebsocketComponent` otvara vezu ka `ws://localhost:1236` (jedna veza po korisniku, deljena za sve sobe).
3. **Klijent se povezuje na sobu.** `HocuspocusRoom` sa imenom = ID fajla javlja serveru: "pretplati me na ovaj dokument".
4. **Hocuspocus pronalazi (ili kreira) odgovarajući Y.Doc.** Ako dokument nije u memoriji, učitava poslednje sačuvano stanje sa backenda (`onLoadDocument` → `GET /files/:id/state`).
5. **Klijent dobija trenutno stanje dokumenta.** Server šalje stanje, klijentov Y.Doc se popuni i Tiptap prikaže sadržaj. Istim kanalom stižu i komentari i awareness (ko je online, gde su kursori).
6. **Korisnik A napravi izmenu.** Otkuca slovo u editoru; Tiptap upiše promenu u lokalni Y.Doc.
7. **Y.js generiše update.** Mala binarna poruka koja opisuje samo tu izmenu.
8. **Update se šalje Hocuspocus serveru** kroz otvorenu WebSocket vezu.
9. **Server prosleđuje update svim ostalim korisnicima** u istoj sobi - u ovom slučaju korisniku B. Server istovremeno primeni update i na svoj primerak dokumenta (koji se periodično čuva u MongoDB).
10. **Klijent B automatski primenjuje promenu.** Njegov Y.Doc primi update, Y.js ga spoji sa eventualnim lokalnim izmenama (CRDT), i editor korisnika B se osveži - slovo se pojavljuje praktično istog trenutka, bez ikakve akcije korisnika B.

Isti tok, sa istim koracima, važi i za komentare (upis u `Y.Map` "comments") i za fajl-sistem (upis u `Y.Map` "fileSystem" pri kreiranju/brisanju fajla) - menja se samo struktura u koju se piše.

---

## 7. Hocuspocus kao centralna komunikaciona komponenta

U sistemu ne postoji klasičan message broker kao što su **RabbitMQ** ili **Kafka**. Ipak, postoji komponenta koja funkcionalno obavlja ulogu posrednika između svih klijenata - i to je upravo **Hocuspocus server**.

Šta broker inače radi, a šta kod nas radi Hocuspocus:

| Uloga posrednika | Kako je obavlja Hocuspocus |
|---|---|
| Prima sve poruke | Svi Y.js update-i svih klijenata stižu prvo na njega |
| Zna ko je pretplaćen na šta | Vodi evidenciju konekcija po sobi (dokumentu) |
| Rutira poruke pravim primaocima | Update prosleđuje samo klijentima u istoj sobi |
| Razdvaja pošiljaoca od primaoca | Klijenti ne znaju jedni za druge; znaju samo za server |

Dakle: **Hocuspocus jeste komunikacioni posrednik ovog sistema** - sve poruke između korisnika prolaze kroz njega i on odlučuje kome će šta biti isporučeno.

### 7.1. Zašto nije potreban klasičan message broker

RabbitMQ/Kafka rešavaju probleme koje ovaj sistem nema:

- **Trajne poruke i redovi:** kod nas poruka (update) nema smisla van dokumenta - čim se primeni na Y.Doc, "potrošena" je; trajnost obezbeđuje snimanje celog stanja u MongoDB, a klijent koji je bio offline ne "prevrće zaostale poruke" nego pri povezivanju dobije aktuelno stanje i sinhronizuje razliku.
- **Više nezavisnih servisa-potrošača:** ovde su jedini potrošači poruka drugi klijenti istog dokumenta, a njih Hocuspocus već poznaje.
- **Garancije redosleda među servisima:** redosled unutar dokumenta garantuje sam CRDT model - update-i se mogu primeniti bilo kojim redosledom sa istim rezultatom.

Uvođenje spoljnog brokera dodalo bi mrežni skok, infrastrukturu i kašnjenje, a ne bi rešilo nijedan stvaran problem sistema. Zato je model *klijent ↔ Hocuspocus ↔ klijent* i jednostavniji i brži.

---

## 8. Prednosti ovakvog modela

- **Mala latencija.** Put izmene je: klijent → server → klijent, preko već otvorene veze, sa porukama od par desetina bajtova. Nema uspostavljanja konekcije, nema polling-a, nema posrednog reda čekanja.
- **Prava komunikacija u realnom vremenu.** Server gura promene čim ih primi; korisnici vide tuđe izmene, kursore i komentare praktično trenutno.
- **Automatska sinhronizacija.** Programer ne piše kôd za slanje/prijem pojedinačnih izmena - dovoljno je pisati u deljenu strukturu (Y.Map, editor), a Y.js + Hocuspocus obave prenos i primenu na svim klijentima.
- **Rešavanje konflikata bez učešća korisnika.** CRDT garantuje da istovremene izmene uvek konvergiraju u isti dokument kod svih; nema zaključavanja ni gubitka teksta.
- **Jednostavno dodavanje novih korisnika.** Novi korisnik = nova konekcija + pretplata na sobu; server mu pošalje trenutno stanje i on odmah ravnopravno učestvuje. Ništa se ne konfiguriše.
- **Skalabilnost.** Jedna WebSocket veza po korisniku (multipleksirane sobe), male poruke, dokumenti se drže u memoriji samo dok ih neko koristi, a čuvanje u bazu je debounce-ovano. Za veća opterećenja Hocuspocus se može horizontalno skalirati, ali za predviđeni obim jedan server je dovoljan.

---

## 9. Zaključak

Real-time komunikacija u ovom sistemu je podela posla između tri sloja:

- **WebSocket** obezbeđuje *kanal*: trajnu, dvosmernu vezu kroz koju server može da gura promene klijentima bez čekanja i bez ponovnog uspostavljanja konekcije.
- **Hocuspocus** obezbeđuje *posredovanje*: prihvata konekcije, drži po jedan živi Y.Doc za svaki otvoren dokument, zna ko je povezan na koji dokument i svaku primljenu izmenu prosleđuje ostalim učesnicima - čime igra ulogu centralnog komunikacionog posrednika sistema (bez potrebe za klasičnim message broker-om). Preko svojih hook-ova vezuje real-time sloj za trajno skladište (REST backend + MongoDB).
- **Y.js** obezbeđuje *sadržaj poruka i njihovo spajanje*: promene pretvara u male update-e, a CRDT model garantuje da se istovremene izmene više korisnika uvek deterministički spoje u identičan dokument kod svih.

Nijedan od ova tri sloja sam nije dovoljan: WebSocket bez Y.js-a ne bi znao *šta* da prenosi niti kako da spoji istovremene izmene; Y.js bez Hocuspocus-a ne bi imao *kome* da pošalje update; Hocuspocus bez WebSocket-a ne bi imao *kanal* kojim promene stižu trenutno. Zajedno čine model u kome više korisnika istovremeno uređuje isti dokument - sa malim kašnjenjem, bez konflikata i bez ijednog ručnog osvežavanja.
