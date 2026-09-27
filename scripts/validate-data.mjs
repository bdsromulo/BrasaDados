import fs from "node:fs/promises";
import path from "node:path";
import { dataDir, root, validate } from "./data-core.mjs";
const entries = await Promise.all(
  (await fs.readdir(dataDir))
    .filter((f) => f.endsWith(".json"))
    .map(async (f) =>
      validate(JSON.parse(await fs.readFile(path.join(dataDir, f), "utf8"))),
    ),
);
const catalog = JSON.parse(
  await fs.readFile(path.join(root, "public/data/catalog.json"), "utf8"),
);
if (
  catalog.length !== entries.length ||
  entries.some((d) => !catalog.find((c) => c.id === d.id))
)
  throw new Error("Catálogo e arquivos divergem");
if (new Set(entries.map((d) => d.slug)).size !== entries.length)
  throw new Error("Slugs duplicados");
for (const d of entries) {
  const c = catalog.find((c) => c.id === d.id);
  const latest =
    d.visualizacao.series[0].dados.filter(([, v]) => v !== null).at(-1) ?? null;
  if (
    c.titulo !== d.titulo ||
    c.slug !== d.slug ||
    c.unit !== d.visualizacao.eixo_y.unidade ||
    c.status !== d.provenance.status ||
    JSON.stringify(c.latest) !== JSON.stringify(latest)
  )
    throw new Error(`Resumo do catálogo desatualizado: ${d.id}`);
}
console.log(
  `${entries.length} indicadores válidos; ${entries.filter((d) => d.provenance.status === "verified").length} conferidos na fonte.`,
);
