import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import {
  root,
  dataDir,
  atomicWrite,
  fetchJSON,
  parseIbge,
  parseBcb,
  parseWorldBank,
  parseCpiBrazil,
  parseInpeFires,
  saveDataset,
  validate,
  rebuildCatalog,
} from "./data-core.mjs";
import {
  makeDataset,
  ibgeSources,
  bcbSources,
  worldBankSources,
  civilSources,
  inpeSources,
} from "./sources.mjs";
const args = process.argv.slice(2);
const selected = args.find((x) => x.startsWith("--id="))?.slice(5);
const today = new Date().toISOString().slice(0, 10);
const report = [];
let stateMap;
async function preserveEvidence(id, requests, responses) {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(responses))
    .digest("hex");
  await atomicWrite(path.join(root, "data/evidence", id + ".json"), {
    retrievedAt: today,
    requests,
    sha256: hash,
    responses,
  });
  return hash;
}
async function ibge(config) {
  if (config.states && !stateMap)
    stateMap = new Map(
      (
        await fetchJSON(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
        )
      ).map((s) => [String(s.id), s]),
    );
  const metadataUrl =
    "https://servicodados.ibge.gov.br/api/v3/agregados/" +
    config.table +
    "/metadados";
  const meta = await fetchJSON(metadataUrl);
  const variable = meta.variaveis?.find(
    (v) => String(v.id) === config.variable,
  );
  if (!variable) throw new Error("Variável ausente nos metadados");
  const base =
    "https://servicodados.ibge.gov.br/api/v3/agregados/" + config.table;
  const url =
    base +
    "/periodos/all/variaveis/" +
    config.variable +
    "?" +
    new URLSearchParams({
      localidades: config.states ? "N1[all]|N3[all]" : "N1[all]",
      ...(config.classification
        ? { classificacao: config.classification }
        : {}),
    });
  const payload = await fetchJSON(url);
  const parsed = parseIbge(payload, config.frequency);
  const national = parsed.filter((s) => s.location.nivel.id === "N1");
  if (
    !national.length ||
    !national.some((s) => s.points.some(([, v]) => v !== null))
  )
    throw new Error("Nenhum valor nacional publicado");
  const d = makeDataset({
    ...config,
    url: "https://sidra.ibge.gov.br/tabela/" + config.table,
  });
  // Preserve existing public links across the migration.
  try {
    const old = JSON.parse(
      await fs.readFile(path.join(dataDir, config.id + ".json"), "utf8"),
    );
    d.slug = old.slug;
  } catch {}
  const label = (s) =>
    config.seriesClassification
      ? Object.values(
          s.classification.find(
            (c) => String(c.id) === config.seriesClassification,
          )?.categoria ?? {},
        )[0]
      : config.title;
  d.fonte.pesquisa = meta.nome;
  d.fonte.frequencia = meta.periodicidade.frequencia;
  d.visualizacao.series = national.map((s, i) => ({
    id: config.id + "-" + i,
    nome: String(label(s) ?? config.title),
    dados: s.points,
  }));
  const latest = d.visualizacao.series[0].dados
    .filter(([, v]) => v !== null)
    .at(-1)[0];
  if (config.states) {
    const firstLabel = label(national[0]);
    const regional = parsed.filter(
      (s) => s.location.nivel.id === "N3" && label(s) === firstLabel,
    );
    d.visualizacao.dados_uf = regional.map((s) => ({
      uf: stateMap.get(s.location.id)?.sigla ?? s.location.id,
      nome: s.location.nome,
      valor: s.points.find(([p]) => p === latest)?.[1] ?? null,
    }));
    d.provenance.stateReference = latest;
    d.provenance.expectedStates = 27;
    if (regional.length !== 27)
      d.provenance.issues.push(
        "A fonte não retornou todas as 27 UFs para este recorte.",
      );
  }
  d.provenance.reference = latest;
  d.provenance.retrievedAt = today;
  d.provenance.sourceUrl = url;
  d.provenance.datasetCode =
    "IBGE " + config.table + " / variável " + config.variable;
  d.provenance.transformation =
    config.id === "economia-rendimento-per-capita"
      ? "Valores reais a preços médios de " +
        meta.periodicidade.fim +
        ", conforme o IBGE. Categorias totais; série reimportada integralmente."
      : "Valores publicados, com conversão dos códigos de período e marcadores de ausência para null; sem interpolação.";
  validate(d);
  d.provenance.sha256 = await preserveEvidence(
    config.id,
    [metadataUrl, url],
    [meta, payload],
  );
  await saveDataset(d);
  return d;
}
async function bcb(config) {
  const now = new Date(),
    endYear = now.getUTCFullYear();
  const requests = [],
    payloads = [];
  for (let y = config.start; y <= endYear; y += 9) {
    const end = Math.min(y + 8, endYear);
    const last =
      end === endYear ? today.split("-").reverse().join("/") : "31/12/" + end;
    const url =
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs." +
      config.code +
      "/dados?" +
      new URLSearchParams({
        formato: "json",
        dataInicial: "01/01/" + y,
        dataFinal: last,
      });
    requests.push(url);
    payloads.push(await fetchJSON(url));
  }
  const points = parseBcb(payloads.flat(), config.aggregation);
  if (!points.length) throw new Error("Nenhum ponto válido");
  const d = makeDataset({
    ...config,
    source: "Banco Central do Brasil (BCB)",
    frequency: "monthly",
  });
  try {
    const old = JSON.parse(
      await fs.readFile(path.join(dataDir, config.id + ".json"), "utf8"),
    );
    d.slug = old.slug;
  } catch {}
  d.fonte.pesquisa =
    "Sistema Gerenciador de Séries Temporais — SGS " + config.code;
  d.visualizacao.series = [
    { id: config.id, nome: config.title, dados: points },
  ];
  d.provenance = {
    ...d.provenance,
    datasetCode: "SGS " + config.code,
    retrievedAt: today,
    reference: points.at(-1)[0],
    sourceUrl: requests.at(-1),
    transformation:
      config.aggregation === "mean-month"
        ? "Média aritmética das observações diárias publicadas em cada mês; arredondada a quatro casas decimais."
        : "Última observação publicada de cada mês. Meta Selic e razão dívida/PIB não são somadas.",
    issues: [
      "A última observação mensal pode representar um mês ainda em andamento.",
    ],
  };
  validate(d);
  d.provenance.sha256 = await preserveEvidence(config.id, requests, payloads);
  await saveDataset(d);
  return d;
}
async function worldBank(config) {
  const metadataUrl = `https://api.worldbank.org/v2/indicator/${config.code}?format=json`;
  const dataUrl = `https://api.worldbank.org/v2/country/BRA/indicator/${config.code}?format=json&per_page=20000`;
  const meta = await fetchJSON(metadataUrl);
  if (meta[1]?.[0]?.id !== config.code || meta[1]?.[0]?.source?.id !== "2")
    throw new Error("Metadados do Banco Mundial incompatíveis");
  const payload = await fetchJSON(dataUrl);
  const points = parseWorldBank(payload, config.code);
  const d = makeDataset(config);
  const old = JSON.parse(
    await fs.readFile(path.join(dataDir, config.id + ".json"), "utf8"),
  );
  d.slug = old.slug;
  d.visualizacao.series = [
    { id: config.id, nome: config.title, dados: points },
  ];
  d.provenance = {
    ...d.provenance,
    reference: points.at(-1)[0],
    retrievedAt: today,
    datasetCode: "WDI / " + config.code,
    sourceUrl: dataUrl,
    transformation:
      "Valores numéricos preservados da API WDI. Apenas anos vazios antes da primeira e após a última observação são excluídos; lacunas internas permanecem ausentes. Metadados da origem: " +
      meta[1][0].sourceOrganization,
    issues: [
      "Atualização do conjunto WDI: " +
        payload[0].lastupdated +
        ". Esta data não é a referência nem a data individual de publicação de cada observação.",
    ],
  };
  validate(d);
  d.provenance.sha256 = await preserveEvidence(
    config.id,
    [metadataUrl, dataUrl],
    [meta, payload],
  );
  await saveDataset(d);
  return d;
}
async function civil(config) {
  const response = await fetch(config.url, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error("Página CPI HTTP " + response.status);
  const html = await response.text();
  const points = parseCpiBrazil(html);
  const d = makeDataset({ ...config, frequency: "annual", display: "line" });
  const old = JSON.parse(
    await fs.readFile(path.join(dataDir, config.id + ".json"), "utf8"),
  );
  d.slug = old.slug;
  d.visualizacao.series = [{ id: config.id, nome: "Brasil", dados: points }];
  d.provenance = {
    ...d.provenance,
    sourceUrl: config.url,
    datasetCode: "CPI / Brazil country profile / linechartData",
    reference: points.at(-1)[0],
    retrievedAt: today,
    transformation:
      "Valores da série anual 2012 em diante publicados no perfil do Brasil pela Transparência Internacional. Sem cálculo de ranking ou preenchimento de anos.",
    issues: [
      "A data de atualização desta página não identifica a publicação de cada ponto histórico.",
    ],
  };
  validate(d);
  d.provenance.sha256 = await preserveEvidence(config.id, [config.url], [html]);
  await saveDataset(d);
  return d;
}
async function inpe(config) {
  const stateUrl =
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
  const [payload, stateRows] = await Promise.all([
    fetchJSON(config.url),
    fetchJSON(stateUrl),
  ]);
  const { points, states } = parseInpeFires(
    payload,
    Number(today.slice(0, 4)) - 1,
  );
  const stateMap = new Map(stateRows.map((row) => [Number(row.id), row]));
  if (
    stateMap.size !== 27 ||
    [...states.keys()].some((id) => !stateMap.has(id))
  )
    throw new Error("Códigos estaduais INPE/IBGE incompatíveis");
  const d = makeDataset(config);
  const old = JSON.parse(
    await fs.readFile(path.join(dataDir, config.id + ".json"), "utf8"),
  );
  d.slug = old.slug;
  d.visualizacao.series = [
    { id: "focos", nome: "Brasil · focos ativos", dados: points },
  ];
  d.visualizacao.dados_uf = [...states].map(([id, valor]) => ({
    uf: stateMap.get(id).sigla,
    nome: stateMap.get(id).nome,
    valor,
  }));
  d.provenance = {
    ...d.provenance,
    sourceUrl: config.url,
    datasetCode:
      "INPE Programa Queimadas / brasil.json / satélite de referência",
    reference: points.at(-1)[0],
    stateReference: points.at(-1)[0],
    expectedStates: 27,
    retrievedAt: today,
    transformation:
      "Soma dos totais por estado e bioma em cada ano civil completo a partir de 2013. Meses e UFs validados; anos parciais e a transição de satélite de 2012 excluídos.",
  };
  validate(d);
  d.provenance.sha256 = await preserveEvidence(
    config.id,
    [config.url, stateUrl],
    [payload, stateRows],
  );
  await saveDataset(d);
  return d;
}
const jobs = [
  ...ibgeSources.map((c) => ({ config: c, fn: ibge })),
  ...bcbSources.map((c) => ({ config: c, fn: bcb })),
  ...worldBankSources.map((c) => ({ config: c, fn: worldBank })),
  ...civilSources.map((c) => ({ config: c, fn: civil })),
  ...inpeSources.map((c) => ({ config: c, fn: inpe })),
].filter((j) => !selected || j.config.id === selected);
if (selected && !jobs.length)
  throw new Error("Indicador não configurado: " + selected);
for (const job of jobs) {
  try {
    const d = await job.fn(job.config);
    report.push({
      id: d.id,
      status: "updated",
      reference: d.provenance.reference,
    });
    console.log("OK", d.id, d.provenance.reference);
  } catch (e) {
    report.push({ id: job.config.id, status: "failed", error: e.message });
    console.error(
      "FALHOU; versão anterior preservada:",
      job.config.id,
      e.message,
    );
  }
}
await rebuildCatalog();
const executedAt = new Date().toISOString();
let previous = [];
try {
  previous = JSON.parse(
    await fs.readFile(path.join(root, "data/sync-report.json"), "utf8"),
  ).results;
} catch {}
await atomicWrite(path.join(root, "data/sync-report.json"), {
  executedAt,
  results: [
    ...previous.filter((r) => !report.some((n) => n.id === r.id)),
    ...report.map((r) => ({ ...r, checkedAt: executedAt })),
  ],
});
if (report.some((r) => r.status === "failed")) process.exitCode = 1;
