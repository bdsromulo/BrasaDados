import fs from "node:fs/promises";
import path from "node:path";
import { root, dataDir, validate, atomicWrite } from "./data-core.mjs";
const legacy = JSON.parse(
  await fs.readFile(path.join(root, "public/data/legacy-audit.json"), "utf8"),
);
const datasets = await Promise.all(
  (await fs.readdir(dataDir))
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map(async (f) =>
      validate(JSON.parse(await fs.readFile(path.join(dataDir, f), "utf8"))),
    ),
);
const rows = datasets.map((d) => {
  const periods = d.visualizacao.series
    .flatMap((s) => s.dados.map(([p]) => p))
    .sort();
  return {
    id: d.id,
    title: d.titulo,
    original: legacy.some((l) => l.id === d.id),
    definition: d.explicacao_leiga.resumo,
    source: d.fonte.orgao,
    sourceUrl: d.provenance.sourceUrl,
    code: d.provenance.datasetCode ?? "Não documentado no acervo",
    status: d.provenance.status,
    unit: d.visualizacao.eixo_y.unidade,
    frequency: d.provenance.frequency,
    from: periods[0],
    to: periods.at(-1),
    recommended: d.visualizacao.tipo_padrao,
    series: d.visualizacao.series.length,
    states: d.provenance.stateReference
      ? (d.visualizacao.dados_uf?.filter((s) => s.valor !== null).length ?? 0)
      : 0,
    stateReference: d.provenance.stateReference ?? null,
    retrievedAt: d.provenance.retrievedAt ?? null,
    publishedAt: d.provenance.publishedAt ?? null,
    transformation: d.provenance.transformation,
    issues: d.provenance.issues,
    originalFindings: legacy.find((l) => l.id === d.id)?.issues ?? [],
  };
});
await atomicWrite(path.join(root, "public/data/audit.json"), rows);
const safe = (value) =>
  String(value).replaceAll("|", "/").replaceAll("\n", " ");
const table = rows
  .map(
    (r) =>
      `| ${safe(r.title)} | ${r.original ? "Original" : "Novo"} | ${r.status === "verified" ? "Conferido" : "Pendente"} | ${safe(r.unit)} | ${r.frequency} | ${r.from}–${r.to} | ${r.stateReference ? r.states + " UFs · " + r.stateReference : "Sem ranking documentado"} |`,
  )
  .join("\n");
const details = rows
  .map(
    (r) =>
      `### ${r.title}\n\n- ID: \`${r.id}\`; ${r.original ? "acervo original" : "primeiro lote novo"}.\n- Definição: ${r.definition}\n- Fonte: [${r.source}](${r.sourceUrl}); código: ${r.code}.\n- Coleta: ${r.retrievedAt ?? "não documentada"}; publicação: ${r.publishedAt ?? "não informada"}.\n- Transformação: ${r.transformation}\n- Visualização recomendada: ${r.recommended === "bar" ? "colunas" : "linhas"}.\n- Pendências/limitações: ${r.issues.join(" ") || "Ver limitações metodológicas no arquivo do indicador."}\n`,
  )
  .join("\n");
await fs.mkdir(path.join(root, "docs"), { recursive: true });
await fs.writeFile(
  path.join(root, "docs/AUDITORIA.md"),
  `# Inventário de auditoria\n\nGerado por \`npm run data:audit\`. ${rows.length} indicadores; ${rows.filter((r) => r.original).length} originais; ${rows.filter((r) => r.status === "verified").length} conferidos; ${rows.filter((r) => r.status === "review").length} pendentes de conferência numérica.\n\nA validação estrutural não atesta a correção dos valores. O inventário preserva o diagnóstico original e a situação atual em [audit.json](../public/data/audit.json). Não declarar os indicadores pendentes como numericamente auditados.\n\n| Indicador | Origem | Valores | Unidade | Frequência | Histórico disponível | Ranking disponível |\n| --- | --- | --- | --- | --- | --- | --- |\n${table}\n\n## Definições, fontes e transformações\n\n${details}`,
);
console.log("Inventário atualizado:", rows.length, "indicadores");
