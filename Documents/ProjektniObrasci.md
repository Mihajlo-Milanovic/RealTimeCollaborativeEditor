# Projektni obrasci u RTCE projektu

**Projekat:** Real-Time Collaborative Editor (RTCE)
**Tema dokumenta:** koji su projektni obrasci (design patterns) korišćeni, gde se nalaze u kodu i kako rade — objašnjeno jednostavnim jezikom.

---

## 1. Uvod — šta je uopšte "projektni obrazac"?

Projektni obrazac (engl. *design pattern*) je **provereno rešenje za problem koji se u programiranju stalno ponavlja**. Nije gotov kod koji se kopira, već recept: "kada imaš ovakav problem, organizuj klase i objekte na ovakav način".

Poređenje iz stvarnog života: u građevini postoje standardna rešenja — "kako se pravi stepenište", "kako se izvodi temelj na peskovitom tlu". Svaka kuća je drugačija, ali stepenište se ne izmišlja iznova za svaku. Projektni obrasci su to isto, samo za softver.

Većina obrazaca u ovom dokumentu potiče iz čuvene knjige "Gang of Four" (GoF) — četvorice autora koji su 1994. popisali i imenovali najčešća rešenja. Zato se za neke obrasce kaže "GoF obrazac".

### Pregled obrazaca u projektu

| Obrazac | Gde se koristi | Šta rešava |
|---|---|---|
| **Strategy** | Izvoz dokumenta (HTML/MD/PDF/DOCX) | Više načina da se uradi ista stvar, zamenljivih u toku rada |
| **Visitor** | Live Analytics panel | Više različitih "merenja" nad istim stablom dokumenta |
| **Proxy (zaštitni)** | Kontrola pristupa (admin/editor/viewer) | Provera dozvole pre svake izmene, na jednom mestu |
| **Observer** | Fajl-sistem, komentari, uloge, analitika | Automatsko obaveštavanje "nešto se promenilo" |
| **Mediator (posrednik)** | Hocuspocus server | Klijenti ne komuniciraju direktno, već preko centrale |
| **Singleton** | user, fileSystemStore, commentsStore… | Tačno jedan primerak deljenog stanja |
| **Registry + fabrika** | Registracija strategija i visitora | Jedno mesto gde se "spisak mogućnosti" održava |
| **Fasada** | `apiClient` | Jednostavan ulaz u komplikovan podsistem (REST API) |
| **Slojevita arhitektura, DAO, DTO** | Ceo backend | Red i podela odgovornosti od HTTP zahteva do baze |
| **Chain of Responsibility** | Express middleware lanac | Zahtev prolazi kroz niz obrada, svaka radi svoj deo |

---

## 2. Strategy — izvoz dokumenta u više formata

### Šta je, prostim jezikom

Zamislite da do posla možete autom, biciklom ili autobusom. **Cilj je isti (stići na posao), a način — strategija — se bira po potrebi.** Strategy obrazac kaže: svaki način spakuj u posebnu klasu sa istim "interfejsom" (isti ulaz, isti izlaz), pa ih onda možeš menjati kao kertridže — bez prepravke ostatka koda.

Bez ovog obrasca, kod za izvoz bi bio jedna ogromna funkcija sa `if (format == "pdf") ... else if (format == "docx") ...` — svaki novi format značio bi kopanje po postojećem kodu.

### Gde u projektu

- `frontend/src/lib/export/types.ts` — zajednički interfejs `ExportStrategy`
- `frontend/src/lib/export/strategies/` — četiri konkretne strategije: `HtmlExportStrategy`, `MarkdownExportStrategy`, `PdfExportStrategy`, `DocxExportStrategy`
- `frontend/src/lib/export/ExportContext.ts` — "Context" koji bira i pokreće strategiju
- `frontend/src/lib/export/exportRegistry.ts` — mesto gde se strategije registruju
- `frontend/src/app/editor/ExportMenu.tsx` — dugme/meni u toolbaru koji sve ovo koristi

### Kako radi ovde

1. Svaka strategija implementira isti interfejs: ima svoj `format` ("pdf"), `label` za meni ("PDF"), ekstenziju, i jednu metodu `export(doc) → Blob` (fajl).
2. Sve strategije dobijaju **identičan ulaz** (`ExportDocument`: naslov + HTML + ProseMirror JSON dokumenta) — nijedna ne čita editor direktno. Svaka od njih iskoristi oblik koji joj odgovara (Markdown se pravi iz HTML-a, PDF i DOCX iz JSON stabla).
3. `ExportContext` drži mapu `format → strategija`. Kada korisnik u meniju klikne "PDF", Context nađe odgovarajuću strategiju u mapi (bez ijednog `if/else`), pozove njen `export()` i preuzme dobijeni fajl.
4. Meni ne zna nijedan format unapred — listu čita iz `exportContext.list()`.

### Šta se time dobija

Dodavanje novog formata (npr. TXT) = jedna nova klasa + jedna linija registracije u `exportRegistry.ts`. Meni ga automatski prikaže, a **nijedan postojeći fajl se ne menja**. To je princip "otvoren za proširenje, zatvoren za izmenu" (Open/Closed).

---

## 3. Visitor — Live Analytics panel

### Šta je, prostim jezikom

Zamislite zgradu kroz koju prolaze različiti inspektori: jedan broji prozore, drugi meri instalacije, treći proverava protivpožarnu opremu. **Zgrada se ne menja — svaki inspektor (visitor, "posetilac") prolazi kroz iste prostorije i beleži ono što njega zanima.**

Visitor obrazac se koristi kada nad istom strukturom podataka treba izvoditi različite operacije, a ne želimo da tu strukturu zatrpavamo tuđim kodom.

### Gde u projektu

- `frontend/src/lib/analytics/types.ts` — interfejs `DocumentVisitor`
- `frontend/src/lib/analytics/walker.ts` — centralni "šetač" kroz dokument
- `frontend/src/lib/analytics/visitors/` — tri visitora: `TextStatsVisitor` (reči/karakteri), `StructureVisitor` (naslovi, liste, slike…), `ReadingTimeVisitor` (procena vremena čitanja)
- `frontend/src/lib/analytics/registry.ts` — spisak visitora
- `frontend/src/lib/analytics/useLiveAnalytics.ts` + `frontend/src/app/editor/LiveAnalyticsPanel.tsx` — prikaz u uglu editora

### Kako radi ovde

1. "Zgrada" je ProseMirror stablo dokumenta (pasusi, naslovi, liste, tekst…).
2. `walkDocument()` prolazi kroz stablo **jednom** (koristeći postojeći `doc.descendants()`), i za svaki čvor svakom visitoru pozove odgovarajuću metodu. Metoda se bira po imenu tipa čvora: čvor `paragraph` → poziva se `visitParagraph`, čvor `heading` → `visitHeading`. Ako visitor nema tu metodu, koristi se rezervna `visitNode`.
3. Svaki visitor implementira **samo ono što ga zanima**: `TextStatsVisitor` samo `visitText`, `StructureVisitor` naslove/liste/slike itd. Na kraju obilaska svaki vrati svoje metrike kroz `snapshot()`.
4. Panel se osvežava automatski: Tiptap-ov `update` događaj se okida i za tuđe (remote) izmene, pa se visitori ponovo pokreću kad **bilo koji** korisnik promeni dokument (uz debounce od 250 ms da se ne računa na svaki otkucaj).

Mala napomena za one koji znaju teoriju: klasičan Visitor zahteva da svaki čvor ima `accept(visitor)` metodu. ProseMirror čvorovi su tuđe klase i ne možemo im dodavati metode, pa taj "dupli izbor" (koji čvor + koji visitor) ovde izvodi walker — praktična adaptacija istog obrasca.

### Šta se time dobija

Nova metrika (npr. "broj linkova") = jedna nova Visitor klasa + jedna linija u `registry.ts`. Stablo dokumenta, walker, ostali visitori i UI panel se ne diraju. Uz to, sve metrike se računaju u jednom prolazu kroz dokument umesto da svaka prolazi posebno.

---

## 4. Proxy (zaštitni) — kontrola pristupa

### Šta je, prostim jezikom

Proxy je **posrednik koji izgleda potpuno isto kao "prava stvar", ali između vas i nje ubacuje dodatnu proveru**. Kao portir ispred kancelarije: kancelarija radi svoj posao, a portir odlučuje ko uopšte sme da uđe. Bitno je da portir "ima ista vrata" — za pozivaoca je svejedno da li priča sa portirom ili direktno sa kancelarijom.

### Gde u projektu

- `frontend/src/lib/access/accessProxy.ts` — klasa `DocumentAccessProxy`
- `frontend/src/lib/access/accessPolicy.ts` — tabela pravila: koja uloga sme koju akciju
- `frontend/src/lib/access/accessStore.ts` — trenutna uloga korisnika (admin/editor/viewer)
- `frontend/src/lib/access/useCanAccess.ts` — hook kojim UI pita "smem li?"

### Kako radi ovde

1. "Prava stvar" (realni subjekt) je `cService` — sloj koji stvarno šalje izmene komentara i reakcija na backend.
2. `DocumentAccessProxy` implementira **isti interfejs** (`IDocumentMutations`) i omotava `cService`. Komponente nikad ne zovu `cService` direktno — uvek zovu proxy.
3. Pre svake operacije proxy pogleda trenutnu ulogu i tabelu u `accessPolicy.ts` ("viewer ne sme ništa da menja, editor sme sve izmene, admin sve"). Ako je dozvoljeno — prosledi pravom servisu; ako nije — odbije i ništa se ne dešava.
4. Ista odluka se koristi i za izgled UI-a: `useCanAccess("document:edit")` kaže editoru da postane read-only za viewera, i gasi dugmad koja korisniku nisu dozvoljena.

### Šta se time dobija

Odluka "sme / ne sme" postoji na **jednom mestu** umesto rasuta po komponentama. Kad se pravila menjaju, menja se samo tabela u `accessPolicy.ts`. (Podsetnik: frontend proverava radi korisničkog iskustva — konačnu reč uvek ima backend, koji iste zabrane sprovodi u servisima.)

---

## 5. Observer — "javi mi kad se nešto promeni"

### Šta je, prostim jezikom

Observer je **pretplata na novosti**. Kao kada se pretplatite na YouTube kanal: ne proveravate svaki sat da li ima novi video — stigne vam obaveštenje. Jedna strana (izdavač) objavljuje promene, a svi pretplaćeni (posmatrači) automatski budu obavešteni.

### Gde u projektu

Ovo je najrasprostranjeniji obrazac u projektu — na njemu počiva ceo "live" osećaj aplikacije:

- `frontend/src/store/fileSystem.ts` — `subscribe()/unsubscribe()` na Yjs mapu fajl-sistema; kada bilo koji korisnik napravi/obriše fajl, svima se stablo osveži.
- `frontend/src/store/comments.ts` — isti princip za komentare (`Y.Map "comments"`).
- `frontend/src/store/members.ts` + `MembersRealtime.tsx` — isti princip za uloge članova: kada admin promeni nekome privilegiju, pogođeni korisnik istog trenutka dobija novu ulogu (editor postane read-only ako je sada viewer).
- `frontend/src/lib/analytics/useLiveAnalytics.ts` — pretplata na Tiptap `update` događaj (preračunavanje metrika).
- `frontend/src/lib/access/accessStore.ts` (zustand) — komponente su "pretplaćene" na promenu uloge i same se ponovo iscrtaju.
- Awareness (spisak prisutnih korisnika i kursori u `OnlineUsers.tsx`) — takođe pretplata, na "ko je online" kanal.

### Kako radi ovde

Yjs deljene strukture (Y.Map) imaju ugrađen `observe()` mehanizam: naš kod upiše novo stanje u mapu, Yjs + Hocuspocus prenesu izmenu svim klijentima, a kod svakog klijenta se okine njegov observer koji osveži React state → komponenta se ponovo iscrta. Niko nigde ne "proverava na svakih X sekundi" (nema polling-a) — sve je zasnovano na obaveštenjima.

### Šta se time dobija

UI koji se sam ažurira, bez ručnog osvežavanja i bez petlji koje troše resurse. I važno: onaj ko objavljuje promenu ne mora da zna ko je sve sluša.

---

## 6. Mediator (posrednik) — Hocuspocus server

### Šta je, prostim jezikom

Zamislite kontrolu letenja na aerodromu. Avioni **ne dogovaraju sletanje međusobno** — svaki priča samo sa kontrolnim tornjem, a toranj koordinira sve. Mediator obrazac uvodi centralnu komponentu preko koje ide sva komunikacija, umesto da svako priča sa svakim (što bi za *n* učesnika značilo *n·(n−1)/2* veza).

### Gde u projektu

- `frontend/src/server/websocket.ts` — Hocuspocus server (pokreće se uz Next.js u `frontend/src/index.ts`, port 1236)
- Klijentska strana: `HocuspocusProviderWebsocketComponent` (jedna WebSocket veza po korisniku) i `HocuspocusRoom` (sobe) u `frontend/src/app/editor/page.tsx` i `OrganizationExplorer.tsx`
- Detaljan opis cele komunikacije: `Documents/CommunicationModel.md`

### Kako radi ovde

1. Svaki klijent drži jednu vezu **samo ka serveru** — klijenti ne znaju jedni za druge.
2. Server vodi "sobe" (jedna po dokumentu/organizaciji) i evidenciju ko je u kojoj sobi.
3. Kada od jednog klijenta stigne izmena (otkucano slovo, novi komentar, promena uloge), server je primeni na svoj primerak dokumenta i **prosledi svim ostalim klijentima u istoj sobi** — i nikome van nje.
4. Preko svojih "kuka" (`onLoadDocument`/`onStoreDocument`) server povezuje real-time svet sa trajnim skladištem (REST backend + MongoDB).

### Šta se time dobija

Umesto mreže direktnih veza između korisnika — jedna centrala koja zna kome šta treba isporučiti. Dodavanje novog korisnika je trivijalno (samo se poveže na sobu), a Mediator i Observer ovde rade ruku pod ruku: Mediator raznosi poruke između računara, Observer ih unutar svakog računara sprovodi do UI-a.

---

## 7. Singleton — tačno jedan primerak

### Šta je, prostim jezikom

Singleton garantuje da od neke klase **postoji tačno jedan primerak u celoj aplikaciji** i da mu svi pristupaju na istom mestu. Kao matična knjiga u opštini: nema smisla da postoje tri "istine" o istim podacima — postoji jedna, i svi gledaju u nju.

### Gde u projektu

- `frontend/src/store/user.ts` — `User.getInstance()`: podaci ulogovanog korisnika (id, username, organizacije). Učitava se jednom po sesiji; da postoje dva primerka, deo aplikacije bi video starije podatke.
- `frontend/src/store/fileSystem.ts` — `FileSystemStore.getInstance()`: jedna veza ka deljenoj Yjs mapi fajl-sistema.
- `frontend/src/store/comments.ts` — `CommentsStore.getInstance()`: isto za komentare.
- Ista ideja u "modul" varijanti: `export const accessProxy = new DocumentAccessProxy(...)`, `export const exportContext = new ExportContext()...`, `export const membersStore = {...}` — JavaScript moduli se učitavaju jednom, pa je objekat izvezen iz modula prirodno jedinstven. To je moderniji, jednostavniji način da se postigne isto.

### Kako radi ovde

Klasičan recept: konstruktor je privatan (niko sa strane ne može `new User()`), a statička metoda `getInstance()` pri prvom pozivu napravi primerak i posle uvek vraća taj isti.

### Šta se time dobija

Jedan izvor istine za deljeno stanje — nema raštimovanih kopija. (Napomena: Singleton treba koristiti umereno, jer je u suštini "globalno stanje"; ovde je opravdan baš zato što ove stvari stvarno postoje u jednom primerku: jedan ulogovani korisnik, jedan deljeni dokument.)

---

## 8. Registry i prosta fabrika — jedno mesto za "spisak mogućnosti"

### Šta je, prostim jezikom

Registry (registar) je **spisak na jednom mestu**: umesto da je znanje "šta sve postoji" rasuto po kodu, postoji jedna sveska u koju se sve upisuje. Fabrika je funkcija/klasa čiji je jedini posao da **pravi objekte**, pa pozivaoci ne moraju da znaju detalje pravljenja.

### Gde u projektu

- `frontend/src/lib/export/exportRegistry.ts` — jedino mesto gde se export strategije registruju u Context.
- `frontend/src/lib/analytics/registry.ts` — funkcija `createVisitors()` koja pravi sveže visitore za svaki proračun (prosta fabrička funkcija + registar u jednom).

### Šta se time dobija

Kada sutra neko doda peti format izvoza ili četvrtu metriku, tačno se zna gde ide ta jedna linija — i to je jedina izmena postojećeg koda. Ova dva mala obrasca su "lepak" koji čini da Strategy i Visitor zaista budu lako proširivi.

---

## 9. Fasada — `apiClient`

### Šta je, prostim jezikom

Fasada je **jednostavno dugme ispred komplikovane mašinerije**. Recepcija hotela: vi kažete "treba mi taksi u 7", a recepcija zove taksi službu, budilnik, i šta već treba — vi ne morate da znate nijedan od tih brojeva.

### Gde u projektu

- `frontend/src/lib/apiClient.ts` — objekat `apiClient` sa grupama `explorer`, `file`, `user`.
- Sličnu ulogu za komentare ima `cService` (`frontend/src/app/editor/comments/services/cService.ts`).

### Kako radi ovde

Komponenta pozove npr. `apiClient.explorer.createNode(...)` — jedan poziv. Iza te fasade se dešava: sastavljanje URL-a i HTTP zahteva, slanje na pravi endpoint (fajl/folder/organizacija idu na različite), obrada odgovora i greške, pa čak i upis novog čvora u deljenu Yjs mapu da bi svi korisnici odmah videli promenu. Nijedna komponenta ne zna te detalje — i ne treba da zna.

### Šta se time dobija

Kada se promeni backend ruta ili format odgovora, menja se jedno mesto. Komponente ostaju čiste i čitljive.

---

## 10. Backend: slojevita arhitektura, DAO i DTO

### Šta je, prostim jezikom

Backend je organizovan kao **fabrička traka sa jasnim stanicama** — svaka stanica radi tačno jedan posao i prosleđuje sledećoj:

```
HTTP zahtev
   │
   ▼
Routes        (backend/src/routes/)        — "koja adresa vodi kod koga"
   │
   ▼
Validation    (backend/src/middlewares/validation/) — "da li je zahtev ispravan"
   │
   ▼
Controllers   (backend/src/controllers/)   — "prevedi HTTP u poziv logike i nazad"
   │
   ▼
Services      (backend/src/services/)      — "poslovna pravila" (npr. samo admin menja uloge)
   │
   ▼
DAO / šeme    (backend/src/data/dao/)      — "razgovor sa bazom" (Mongoose modeli)
   │
   ▼
MongoDB
```

Uz to idu još dva mala obrasca:

- **DAO (Data Access Object)** — folder `backend/src/data/dao/` doslovno tako i nazvan: klase/šeme koje jedine znaju kako podaci izgledaju u bazi (`UserSchema`, `OrganizationSchema`, `FileSchema`…). Servisi rade sa njima, a ne sa "sirovom" bazom.
- **DTO / View objekti** — `backend/src/data/types/` (`toUserView`, `toOrganizationView`, `toFileView`…): pre slanja klijentu, interni zapis iz baze se "prepakuje" u čist oblik za prenos. Klijent tako nikad ne vidi interne detalje baze (npr. Mongoose polja), a backend može da menja bazu bez lomljenja frontenda.

### Šta se time dobija

Svaki sloj se može menjati (ili testirati) nezavisno. Kada tražite gde se nešto dešava, znate tačno u koji sloj da pogledate: pravilo pristupa? — servis; oblik podataka u bazi? — DAO; adresa endpointa? — ruta.

---

## 11. Chain of Responsibility — Express middleware lanac

### Šta je, prostim jezikom

Zahtev prolazi kroz **niz šaltera, jedan za drugim**. Svaki šalter uradi svoj deo (proveri papire, udari pečat) i prosledi dalje — ili zaustavi ceo postupak ako nešto ne valja. Nijedan šalter ne zna ceo proces; zna samo svoj korak i kome prosleđuje.

### Gde u projektu

`backend/src/app.ts` slaže lanac: `cors` (ko sme da pristupi) → `express.json` (raspakivanje JSON tela) → `logger` (beleženje) → validacione provere konkretne rute → kontroler → i na kraju `errorHandler` (ako bilo ko u lancu prijavi grešku, ovde se pretvara u uredan odgovor). Primer u praksi: promena uloge člana prvo prolazi `validateMembersIdsAndRoles` (da li je uloga uopšte dozvoljena vrednost), pa tek onda stiže do kontrolera i servisa.

Ovaj obrazac je ugrađen u sam Express (`app.use(...)` + `next()`), a projekat ga koristi za razdvajanje tehničkih briga od poslovne logike.

---

## 12. Kako obrasci rade zajedno — jedan primer od početka do kraja

Scenario: **admin menja ulogu člana u "viewer", a taj član trenutno uređuje dokument.**

1. Admin klikne "Change role" (UI nudi samo editor/viewer — pravilo "jedan admin").
2. Zahtev prolazi backend **lanac** (validacija odbija nedozvoljene uloge) i stiže u **servis**, koji proverava poslovna pravila (pozivalac mora biti admin, adminu se uloga ne dira) i upisuje promenu kroz **DAO** u bazu. Nazad ide čist **DTO** odgovor.
3. Adminov klijent povuče sveže stanje članova i upiše ga u deljenu Yjs mapu — od tog trenutka priču preuzima **Mediator** (Hocuspocus), koji izmenu prosledi svim klijentima u sobi te organizacije.
4. Kod pogođenog člana okida se **Observer** (`MembersRealtime` → `accessStore`), na šta **Proxy** počinje da odbija sve izmene, editor postaje read-only, dugmad se gase — bez refresh-a.
5. Ako taj korisnik potom izveze dokument u PDF, radi to kroz **Strategy**; dok kuca, metrike mu u uglu osvežava **Visitor**; a sve vreme njegovo stanje drže **Singleton** store-ovi i pozivi idu kroz **Fasadu**.

Poenta cele priče: nijedan obrazac ovde nije upotrebljen "da bi ga bilo", već svaki rešava konkretan, opipljiv problem — a zajedno daju sistem koji je lako proširiti (novi format, nova metrika, nova uloga) uz minimalne izmene postojećeg koda.
