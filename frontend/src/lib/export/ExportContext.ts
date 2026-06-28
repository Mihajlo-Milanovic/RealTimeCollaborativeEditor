import {ExportDocument, ExportStrategy} from "./types";

/**
 * GoF Strategy "Context".
 *
 * Jedino mesto koje BIRA strategiju (lookup po formatu u Map-i — bez switch/if-else)
 * i izvršava izvoz. Registracija je generička: dodavanje novog formata ne menja
 * postojeće strategije ni logiku Context-a (Open/Closed Principle).
 */
export class ExportContext {
    private readonly strategies = new Map<string, ExportStrategy>();

    register(strategy: ExportStrategy): this {
        this.strategies.set(strategy.format, strategy);
        return this;
    }

    /** Dostupne strategije — UI ih čita odavde umesto da hardkoduje formate. */
    list(): ExportStrategy[] {
        return [...this.strategies.values()];
    }

    /** Izabere strategiju za format, generiše fajl i pokrene preuzimanje. */
    async export(format: string, doc: ExportDocument): Promise<void> {
        const strategy = this.strategies.get(format);
        if (!strategy) throw new Error(`Nepoznat export format: "${format}".`);

        const blob = await strategy.export(doc);
        this.download(blob, `${this.safeName(doc.title)}.${strategy.extension}`);
    }

    private download(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    private safeName(name: string): string {
        return (name || "document").replace(/[^\w.\-]+/g, "_").slice(0, 80) || "document";
    }
}
