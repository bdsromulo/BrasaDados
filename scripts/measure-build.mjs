import fs from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { root, atomicWrite } from "./data-core.mjs";
const dir = path.join(root, "dist/assets");
const assets = await fs.readdir(dir);
const html = await fs.readFile(path.join(root, "dist/index.html"), "utf8");
const used = new Set(assets.filter((f) => html.includes(f)));
for (const file of used) {
  if (!file.endsWith(".js") && !file.endsWith(".css")) continue;
  const source = await fs.readFile(path.join(dir, file), "utf8");
  for (const candidate of assets)
    if (source.includes(candidate)) used.add(candidate);
}
const files = [
  ...[...used]
    .filter((f) => f.endsWith(".js") || f.endsWith(".css"))
    .map((f) => ["assets/" + f, path.join(dir, f)]),
  ["data/catalog.json", path.join(root, "dist/data/catalog.json")],
];
const report = [];
for (const [file, absolute] of files) {
  const bytes = await fs.readFile(absolute);
  report.push({ file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length });
}
const result = {
  method:
    "Tamanho dos artefatos do build e compressão gzip local; não mede latência, LCP ou desempenho em telefone físico.",
  assets: report,
};
await atomicWrite(path.join(root, "docs/build-size.json"), result);
console.table(report);
