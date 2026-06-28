import {ExportContext} from "./ExportContext";
import {HtmlExportStrategy} from "./strategies/HtmlExportStrategy";
import {MarkdownExportStrategy} from "./strategies/MarkdownExportStrategy";
import {PdfExportStrategy} from "./strategies/PdfExportStrategy";
import {DocxExportStrategy} from "./strategies/DocxExportStrategy";

/**
 * JEDINO mesto gde se strategije registruju u Context.
 * Dodavanje novog formata (npr. TXT/ODT) = nova strategija klasa + jedna
 * .register(...) linija ovde. Postojeće strategije i Context ostaju netaknuti.
 */
export const exportContext = new ExportContext()
    .register(new HtmlExportStrategy())
    .register(new MarkdownExportStrategy())
    .register(new PdfExportStrategy())
    .register(new DocxExportStrategy());
