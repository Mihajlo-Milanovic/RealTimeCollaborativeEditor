import * as Y from "yjs";

export function createYDoc(): Y.Doc {
  return new Y.Doc();
}

export function applyStateUpdate(doc: Y.Doc, update: Uint8Array) {
  Y.applyUpdate(doc, update);
}

export function encodeStateUpdate(doc: Y.Doc): Uint8Array {
  return Y.encodeStateAsUpdate(doc);
}
