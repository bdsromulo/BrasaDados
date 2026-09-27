import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const root = path.resolve(import.meta.dirname, "..");
export const dataDir = path.join(root, "public/data/indicators");
export function validPeriod(p) {
  if (typeof p !== "string") return false;
  if (/^\d{4}(-Q[1-4])?$/.test(p)) return true;
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(p)) return true;
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(p) &&
    !Number.isNaN(Date.parse(p)) &&
    new Date(p).toISOString().slice(0, 10) === p
  );
}
export function validate(d) {
  const errors = [];
  if (!d || typeof d !== "object")
    throw new Error("Indicador deve ser um objeto");
  if (!/^[a-z0-9-]+$/.test(d.id || "")) errors.push("ID inválido");
  if (!/^[a-z0-9-]+$/.test(d.slug || "")) errors.push("Slug inválido");
  if (
    ![
      "economia",
      "educacao",
      "saude",
      "seguranca",
      "meio-ambiente",
      "internacional",
    ].includes(d.categoria)
  )
    errors.push("Categoria inválida");
  if (!Array.isArray(d.tags) || d.tags.some((t) => typeof t !== "string"))
    errors.push("Tags inválidas");
  for (const value of [
    d.fonte?.orgao,
    d.fonte?.pesquisa,
    d.fonte?.frequencia,
    d.explicacao_leiga?.resumo,
    d.explicacao_leiga?.como_interpretar,
    d.explicacao_leiga?.por_que_importa,
    d.detalhamento_tecnico?.formula_calculo,
    d.detalhamento_tecnico?.amostra_cobertura,
    d.detalhamento_tecnico?.limitacoes_e_quebras_metodologicas,
    d.detalhamento_tecnico?.orientacoes_fact_checking,
    d.visualizacao?.eixo_y?.unidade,
  ]) {
    if (typeof value !== "string" || !value.trim())
      errors.push("Metadados de fonte, unidade ou explicação incompletos");
  }
  if (
    !d.titulo ||
    !d.fonte?.url_oficial?.startsWith("https://") ||
    !d.provenance?.sourceUrl?.startsWith("https://")
  )
    errors.push("Título ou fonte HTTPS ausente");
  if (!["verified", "review"].includes(d.provenance?.status))
    errors.push("Situação de auditoria ausente");
  if (
    !["government", "international", "civil"].includes(
      d.provenance?.organizationType,
    )
  )
    errors.push("Natureza da fonte inválida");
  if (
    !["official", "provisional", "estimate", "undocumented"].includes(
      d.provenance?.observationStatus,
    )
  )
    errors.push("Natureza da observação inválida");
  if (
    !Array.isArray(d.provenance?.issues) ||
    d.provenance.issues.some((x) => typeof x !== "string")
  )
    errors.push("Limitações não documentadas");
  if (!validPeriod(d.provenance?.reference)) errors.push("Referência inválida");
  for (const value of [d.provenance?.publishedAt, d.provenance?.retrievedAt])
    if (value !== undefined && (!validPeriod(value) || value.length !== 10))
      errors.push("Data de publicação ou coleta inválida");
  if (
    ![
      "annual",
      "quarterly",
      "monthly",
      "daily",
      "biennial",
      "irregular",
    ].includes(d.provenance?.frequency)
  )
    errors.push("Frequência inválida");
  if (!["line", "bar"].includes(d.visualizacao?.tipo_padrao))
    errors.push("Visualização inválida");
  if (!d.visualizacao?.series?.length) errors.push("Séries ausentes");
  const ids = new Set();
  for (const s of d.visualizacao?.series ?? []) {
    if (typeof s.nome !== "string" || !s.id)
      errors.push("Identificação de série ausente");
    if (!Array.isArray(s.dados) || !s.dados.length) errors.push("Série vazia");
    if (ids.has(s.id)) errors.push("Série duplicada");
    ids.add(s.id);
    let previous = "";
    for (const [p, v] of s.dados ?? []) {
      if (!validPeriod(p) || p <= previous)
        errors.push(`Período inválido, fora de ordem ou duplicado: ${p}`);
      const formats = {
        annual: /^\d{4}$/,
        biennial: /^\d{4}$/,
        monthly: /^\d{4}-\d{2}$/,
        quarterly: /^\d{4}-Q[1-4]$/,
        daily: /^\d{4}-\d{2}-\d{2}$/,
      };
      if (
        formats[d.provenance?.frequency] &&
        !formats[d.provenance.frequency].test(p)
      )
        errors.push("Período incompatível com frequência");
      if (v !== null && (typeof v !== "number" || !Number.isFinite(v)))
        errors.push(`Valor inválido: ${p}`);
      previous = p;
    }
  }
  if (
    d.provenance?.status === "verified" &&
    (!d.provenance.retrievedAt ||
      !d.provenance.datasetCode ||
      !d.provenance.transformation)
  )
    errors.push("Rastreabilidade incompleta");
  if (
    d.visualizacao?.dados_uf?.length &&
    d.provenance?.status === "verified" &&
    !d.provenance.stateReference
  )
    errors.push("Ranking sem referência");
  if (
    new Set(d.visualizacao?.dados_uf?.map((x) => x.uf)).size !==
    (d.visualizacao?.dados_uf?.length ?? 0)
  )
    errors.push("UF duplicada");
  for (const row of d.visualizacao?.dados_uf ?? [])
    if (
      row.valor !== null &&
      (typeof row.valor !== "number" || !Number.isFinite(row.valor))
    )
      errors.push("Valor de UF inválido");
  if (errors.length)
    throw new Error(`${d.id}: ${[...new Set(errors)].join("; ")}`);
  return d;
}
export async function atomicWrite(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temp, JSON.stringify(data, null, 2) + "\n");
    await fs.rename(temp, file);
  } finally {
    await fs.rm(temp, { force: true });
  }
}
export async function saveDataset(d) {
  validate(d);
  await atomicWrite(path.join(dataDir, `${d.id}.json`), d);
}
export async function rebuildCatalog() {
  const datasets = await Promise.all(
    (await fs.readdir(dataDir))
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map(async (f) =>
        validate(JSON.parse(await fs.readFile(path.join(dataDir, f), "utf8"))),
      ),
  );
  const catalog = datasets.map((d) => ({
    id: d.id,
    slug: d.slug,
    titulo: d.titulo,
    categoria: d.categoria,
    tags: d.tags,
    source: d.fonte.orgao,
    summary: d.explicacao_leiga.resumo,
    unit: d.visualizacao.eixo_y.unidade,
    latest:
      d.visualizacao.series[0].dados.filter(([, v]) => v !== null).at(-1) ??
      null,
    status: d.provenance.status,
    frequency: d.provenance.frequency,
    hasStates: Boolean(
      d.visualizacao.dados_uf?.length && d.provenance.stateReference,
    ),
  }));
  await atomicWrite(path.join(root, "public/data/catalog.json"), catalog);
  return datasets;
}
export async function fetchJSON(url) {
  let error;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: { Accept: "application/json" },
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
      return await r.json();
    } catch (e) {
      error = e;
    }
  }
  throw error;
}
export function numeric(v) {
  if (v === null || ["...", "..", "-", "X", ""].includes(String(v).trim()))
    return null;
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) throw new Error(`Valor não numérico: ${v}`);
  return n;
}
export function parseIbge(payload, frequency) {
  if (!Array.isArray(payload) || !payload[0]?.resultados?.length)
    throw new Error("Resposta IBGE sem resultados");
  const normalize = (p) =>
    frequency === "quarterly"
      ? `${p.slice(0, 4)}-Q${Number(p.slice(4))}`
      : frequency === "monthly"
        ? `${p.slice(0, 4)}-${p.slice(4)}`
        : p;
  return payload[0].resultados.flatMap((r) =>
    r.series.map((s) => ({
      location: s.localidade,
      points: Object.entries(s.serie)
        .map(([p, v]) => [normalize(p), numeric(v)])
        .sort(([a], [b]) => a.localeCompare(b)),
      classification: r.classificacoes,
    })),
  );
}
export function parseBcb(rows, aggregation = "last-month") {
  if (!Array.isArray(rows) || !rows.length)
    throw new Error("Resposta BCB vazia");
  const months = new Map();
  const dates = new Set();
  for (const row of rows) {
    if (typeof row.data !== "string" || !/^\d{2}\/\d{2}\/\d{4}$/.test(row.data))
      throw new Error("Data BCB inválida");
    const [day, month, year] = row.data.split("/");
    const date = `${year}-${month}-${day}`;
    if (!validPeriod(date) || dates.has(date))
      throw new Error("Data BCB inválida ou duplicada");
    dates.add(date);
    const key = `${year}-${month}`;
    const value = numeric(row.valor);
    if (value === null) continue;
    const list = months.get(key) ?? [];
    list.push({ date, value });
    months.set(key, list);
  }
  return [...months]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([p, list]) => [
      p,
      aggregation === "mean-month"
        ? Number(
            (list.reduce((n, x) => n + x.value, 0) / list.length).toFixed(4),
          )
        : list.sort((a, b) => a.date.localeCompare(b.date)).at(-1).value,
    ]);
}

export function parseWorldBank(payload, code) {
  if (
    !Array.isArray(payload) ||
    payload[0]?.pages !== 1 ||
    !Array.isArray(payload[1])
  )
    throw new Error(
      "Resposta Banco Mundial vazia ou paginada; atualização recusada",
    );
  const rows = payload[1];
  if (
    rows.some(
      (r) =>
        r.countryiso3code !== "BRA" ||
        r.indicator?.id !== code ||
        !/^\d{4}$/.test(r.date) ||
        r.obs_status,
    )
  )
    throw new Error(
      "País, código, período ou situação da observação inesperados",
    );
  const points = rows
    .map((r) => [r.date, numeric(r.value)])
    .sort(([a], [b]) => a.localeCompare(b));
  const first = points.findIndex(([, v]) => v !== null);
  const last = points.findLastIndex(([, v]) => v !== null);
  if (first < 0) throw new Error("Nenhum valor publicado pelo Banco Mundial");
  return points.slice(first, last + 1);
}

export function parseCpiBrazil(html) {
  if (
    typeof html !== "string" ||
    !html.includes("Corruption Perceptions Index")
  )
    throw new Error("Página CPI Brasil inválida");
  const match = html.match(/window\.linechartData\s*=\s*(\[[^;]+\]);/);
  if (!match) throw new Error("Série histórica CPI ausente");
  const rows = JSON.parse(match[1]);
  if (
    !Array.isArray(rows) ||
    rows.length < 14 ||
    rows[0]?.year !== 2012 ||
    rows.some(
      (r, i) =>
        r.year !== 2012 + i ||
        !Number.isInteger(r.score) ||
        r.score < 0 ||
        r.score > 100,
    )
  )
    throw new Error("Anos ou pontuação CPI incompatíveis");
  return rows.map((r) => [String(r.year), r.score]);
}

export function parseInpeFires(payload, maxYear) {
  const rows = payload?.historico_mensal;
  if (!Array.isArray(rows) || rows.length < 27 * 13)
    throw new Error("Histórico INPE ausente ou curto");
  const years = new Map();
  for (const row of rows) {
    const year = Number(row.ano);
    const state = Number(row.estado?.id_estado);
    const months = row.meses;
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(state) ||
      !months ||
      !Number.isInteger(row.total_focos) ||
      row.total_focos < 0 ||
      !Array.from({ length: 12 }, (_, i) => months[String(i + 1)]).every(
        (v) => v === null || (Number.isInteger(v) && v >= 0),
      )
    )
      throw new Error("Registro INPE inválido");
    if (year < 2013 || year > maxYear) continue;
    if (Object.values(months).some((v) => v === null))
      throw new Error("Ano INPE incompleto: " + year);
    if (Object.values(months).reduce((s, v) => s + v, 0) !== row.total_focos)
      throw new Error("Soma mensal INPE divergente: " + year);
    if (!years.has(year))
      years.set(year, { states: new Map(), keys: new Set() });
    const group = years.get(year);
    const key = state + ":" + row.bioma?.id_bioma;
    if (group.keys.has(key)) throw new Error("Recorte INPE duplicado: " + key);
    group.keys.add(key);
    group.states.set(state, (group.states.get(state) ?? 0) + row.total_focos);
  }
  const ordered = [...years].sort(([a], [b]) => a - b);
  if (
    ordered.length < 13 ||
    ordered.some(
      ([year, group], i) => year !== 2013 + i || group.states.size !== 27,
    )
  )
    throw new Error("Anos ou UFs INPE incompletos");
  return {
    points: ordered.map(([year, group]) => [
      String(year),
      [...group.states.values()].reduce((s, n) => s + n, 0),
    ]),
    states: ordered.at(-1)[1].states,
  };
}
