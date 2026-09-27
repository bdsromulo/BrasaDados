import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import {
  saveDataset,
  rebuildCatalog,
  dataDir,
  root,
  atomicWrite,
  validate,
} from "./data-core.mjs";
import { curatedDatasets } from "./curated-sources.mjs";
// Deterministic import of reviewed transcriptions. A new edition requires a new
// reviewed manifest: never scrape a guessed table or silently append estimates.
const file = process.argv[2];
const datasets = file
  ? JSON.parse(await fs.readFile(file, "utf8"))
  : curatedDatasets;
if (!Array.isArray(datasets))
  throw new Error("O manifesto deve conter uma lista de indicadores.");
datasets.forEach(validate); // Validate the entire batch before any write.
for (const entry of datasets) {
  const d = structuredClone(entry);
  try {
    const old = JSON.parse(
      await fs.readFile(path.join(dataDir, d.id + ".json"), "utf8"),
    );
    d.slug = old.slug;
    if (
      old.provenance.status === "verified" &&
      old.provenance.reference > d.provenance.reference
    )
      throw new Error("Importação recusada: edição anterior à publicada.");
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  d.provenance.sha256 = crypto
    .createHash("sha256")
    .update(JSON.stringify(entry))
    .digest("hex");
  await saveDataset(d);
  await atomicWrite(path.join(root, "data/evidence", d.id + ".json"), {
    kind: "reviewed-transcription",
    source: d.provenance.sourceUrl,
    datasetCode: d.provenance.datasetCode,
    reference: d.provenance.reference,
    reviewedAt: d.provenance.retrievedAt,
    pointer: d.provenance.transformation,
    manifestSha256: d.provenance.sha256,
    series: d.visualizacao.series,
  });
  console.log("IMPORTADO", d.id, d.provenance.reference);
}
await rebuildCatalog();
