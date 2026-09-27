// One-time migration. Never silently replace already audited files.
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import {
  root,
  dataDir,
  saveDataset,
  rebuildCatalog,
  atomicWrite,
} from "./data-core.mjs";

const source = await fs.readFile(
  path.join(root, "src/data/indicators.ts"),
  "utf8",
);
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { INDICADORES_REAIS: list } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
const report = [];
for (const legacy of list) {
  const d = structuredClone(legacy);
  const issues = [
    "Valores legados sem arquivo de extração: conferência numérica pendente.",
  ];
  const points = d.visualizacao.series.flatMap((s) => s.dados);
  const last = String(Math.max(...points.map(([p]) => Number(p))));
  if (last > d.fonte.ultima_atualizacao.slice(0, 4))
    issues.push("Há observações posteriores ao ano da atualização declarada.");
  if (d.visualizacao.dados_uf?.length)
    issues.push(
      `Recorte com ${d.visualizacao.dados_uf.length}/27 UFs; período não registrado no acervo original. Ranking indisponível até conferência.`,
    );
  if (/Mensal|Diária|Trimestral/.test(d.fonte.frequencia))
    issues.push(
      "A frequência anunciada na fonte difere dos pontos anuais armazenados; agregação original não documentada.",
    );
  const org = d.fonte.orgao;
  d.provenance = {
    status: "review",
    organizationType: /FBSP|SEEG|Transparência Internacional/.test(org)
      ? "civil"
      : /OCDE|OMS|Banco Mundial/.test(org)
        ? "international"
        : "government",
    sourceUrl: d.fonte.url_oficial.replace(/^http:/, "https:"),
    reference: last,
    frequency: /Bienal/.test(d.fonte.frequencia) ? "biennial" : "annual",
    observationStatus: "undocumented",
    transformation:
      "Série anual legada. Agregação e valores aguardam conferência na fonte.",
    issues,
    expectedStates: d.visualizacao.dados_uf?.length ? 27 : undefined,
  };
  d.fonte.url_oficial = d.provenance.sourceUrl;
  d.visualizacao.series = d.visualizacao.series.map((s) => ({
    id: s.id,
    nome: s.nome,
    dados: s.dados.map(([p, v]) => [String(p), v]),
  }));
  if (d.id === "economia-taxa-selic") {
    d.fonte.pesquisa = "SGS — Série 432: Meta Selic definida pelo Copom";
    d.fonte.url_oficial =
      "https://dadosabertos.bcb.gov.br/dataset/432-taxa-de-juros---meta-selic-definida-pelo-copom";
    d.provenance.sourceUrl = d.fonte.url_oficial;
    issues.push(
      "Fonte original apontava para SGS 4189, que não é Meta Selic. Corrigida para 432; valores dependem da sincronização.",
    );
  }
  report.push({
    id: d.id,
    source: d.fonte.url_oficial,
    previousUpdate: legacy.fonte.ultima_atualizacao,
    lastReference: last,
    issues,
  });
  try {
    await fs.access(path.join(dataDir, `${d.id}.json`));
  } catch {
    await saveDataset(d);
  }
}
await atomicWrite(path.join(root, "public/data/legacy-audit.json"), report);
await rebuildCatalog();
console.log(
  `Inventário auditado: ${report.length} indicadores. Nenhum valor legado foi declarado verificado.`,
);
