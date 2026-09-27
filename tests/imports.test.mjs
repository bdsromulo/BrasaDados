import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  ibgeSources,
  bcbSources,
  worldBankSources,
  civilSources,
  inpeSources,
} from "../scripts/sources.mjs";
import {
  validate,
  validPeriod,
  parseBcb,
  parseIbge,
  parseWorldBank,
  parseCpiBrazil,
  parseInpeFires,
  numeric,
  atomicWrite,
} from "../scripts/data-core.mjs";
test("published API series replay exactly from preserved source evidence", async () => {
  for (const config of [
    ...ibgeSources,
    ...bcbSources,
    ...worldBankSources,
    ...civilSources,
    ...inpeSources,
  ]) {
    const evidence = JSON.parse(
      await fs.readFile(
        new URL("../data/evidence/" + config.id + ".json", import.meta.url),
        "utf8",
      ),
    );
    const d = JSON.parse(
      await fs.readFile(
        new URL(
          "../public/data/indicators/" + config.id + ".json",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    assert.equal(
      crypto
        .createHash("sha256")
        .update(JSON.stringify(evidence.responses))
        .digest("hex"),
      d.provenance.sha256,
      config.id + ": hash da resposta",
    );
    if (inpeSources.includes(config)) {
      const result = parseInpeFires(
        evidence.responses[0],
        Number(d.provenance.reference),
      );
      assert.deepEqual(
        d.visualizacao.series[0].dados,
        result.points,
        config.id,
      );
      const stateMap = new Map(
        evidence.responses[1].map((row) => [Number(row.id), row]),
      );
      assert.deepEqual(
        d.visualizacao.dados_uf,
        [...result.states].map(([id, valor]) => ({
          uf: stateMap.get(id).sigla,
          nome: stateMap.get(id).nome,
          valor,
        })),
        config.id,
      );
    } else if (civilSources.includes(config)) {
      assert.deepEqual(
        d.visualizacao.series[0].dados,
        parseCpiBrazil(evidence.responses[0]),
        config.id,
      );
    } else if (config.table) {
      const national = parseIbge(
        evidence.responses[1],
        config.frequency,
      ).filter((s) => s.location.nivel.id === "N1");
      assert.deepEqual(
        d.visualizacao.series.map((s) => s.dados),
        national.map((s) => s.points),
        config.id,
      );
    } else if (worldBankSources.includes(config)) {
      assert.deepEqual(
        d.visualizacao.series[0].dados,
        parseWorldBank(evidence.responses[1], config.code),
        config.id,
      );
    } else {
      assert.deepEqual(
        d.visualizacao.series[0].dados,
        parseBcb(evidence.responses.flat(), config.aggregation),
        config.id,
      );
    }
  }
});
const fixture = () => ({
  id: "test",
  slug: "test",
  categoria: "economia",
  tags: ["test"],
  titulo: "Test",
  fonte: {
    url_oficial: "https://example.org",
    orgao: "Test",
    pesquisa: "Test",
    frequencia: "Mensal",
  },
  explicacao_leiga: {
    resumo: "Teste",
    como_interpretar: "Teste",
    por_que_importa: "Teste",
  },
  detalhamento_tecnico: {
    formula_calculo: "Teste",
    amostra_cobertura: "Teste",
    limitacoes_e_quebras_metodologicas: "Teste",
    orientacoes_fact_checking: "Teste",
  },
  provenance: {
    organizationType: "government",
    observationStatus: "official",
    issues: [],
    reference: "2026-02",
    status: "verified",
    sourceUrl: "https://example.org",
    frequency: "monthly",
    retrievedAt: "2026-09-27",
    datasetCode: "TEST",
    transformation: "Sem transformação",
  },
  visualizacao: {
    eixo_y: { unidade: "%" },
    tipo_padrao: "line",
    series: [
      {
        id: "a",
        nome: "Brasil",
        dados: [
          ["2026-01", 1],
          ["2026-02", null],
        ],
      },
    ],
  },
});
test("validation rejects calendar errors, unordered periods and nonfinite values", () => {
  assert.equal(validPeriod("2024-02-29"), true);
  for (const p of ["2023-02-29", "2024-13", "2024-Q5", "bad"])
    assert.equal(validPeriod(p), false);
  const d = fixture();
  d.visualizacao.series[0].dados.reverse();
  assert.throws(() => validate(d), /Período/);
  const e = fixture();
  e.visualizacao.series[0].dados[0][1] = Infinity;
  assert.throws(() => validate(e), /Valor/);
  const f = fixture();
  f.visualizacao.series[0].dados = [];
  assert.throws(() => validate(f), /vazia/);
});
test("verified ranks require date and valid state values", () => {
  const d = fixture();
  d.visualizacao.dados_uf = [{ uf: "SP", valor: NaN }];
  assert.throws(() => validate(d), /Ranking sem referência/);
  d.provenance.stateReference = "2026-01";
  assert.throws(() => validate(d), /Valor de UF/);
});
test("BCB aggregation sorts observations and distinguishes end-month from mean", () => {
  const rows = [
    { data: "31/01/2026", valor: "15" },
    { data: "02/01/2026", valor: "10" },
    { data: "01/03/2026", valor: "12" },
  ];
  assert.deepEqual(parseBcb(rows), [
    ["2026-01", 15],
    ["2026-03", 12],
  ]);
  assert.deepEqual(parseBcb(rows, "mean-month"), [
    ["2026-01", 12.5],
    ["2026-03", 12],
  ]);
  assert.throws(() => parseBcb([]), /vazia/);
  assert.throws(
    () => parseBcb([{ data: "31/02/2026", valor: "1" }]),
    /Data BCB/,
  );
  assert.throws(() => parseBcb([rows[0], rows[0]], "mean-month"), /duplicada/);
});
test("IBGE keeps geographic identifiers and missing observations", () => {
  const rows = parseIbge(
    [
      {
        resultados: [
          {
            classificacoes: [],
            series: [
              {
                localidade: { id: "1", nivel: { id: "N1" } },
                serie: { 202401: "10,5", 202402: "..." },
              },
            ],
          },
        ],
      },
    ],
    "quarterly",
  );
  assert.deepEqual(rows[0].points, [
    ["2024-Q1", 10.5],
    ["2024-Q2", null],
  ]);
  assert.equal(rows[0].location.id, "1");
  assert.equal(numeric("-"), null);
  assert.throws(() => numeric("error"));
});
test("World Bank validates identity and pagination, preserves internal gaps and trims unpublished edges", () => {
  const row = (date, value) => ({
    date,
    value,
    countryiso3code: "BRA",
    indicator: { id: "TEST" },
    obs_status: "",
  });
  const payload = [
    { pages: 1 },
    [
      row("2025", null),
      row("2024", 9.73092747),
      row("2023", null),
      row("2022", 9),
      row("2021", null),
    ],
  ];
  assert.deepEqual(parseWorldBank(payload, "TEST"), [
    ["2022", 9],
    ["2023", null],
    ["2024", 9.73092747],
  ]);
  assert.throws(
    () => parseWorldBank([{ pages: 2 }, payload[1]], "TEST"),
    /paginada/,
  );
  assert.throws(() => parseWorldBank(payload, "WRONG"), /código/);
  payload[1][1].obs_status = "F";
  assert.throws(() => parseWorldBank(payload, "TEST"), /situação/);
});
test("failed import retains last validated file; historical revisions replace it atomically", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "brasa-import-test-"));
  const file = path.join(dir, "snapshot.json");
  try {
    const original = fixture();
    await atomicWrite(file, validate(original));
    const invalid = fixture();
    invalid.visualizacao.series[0].dados[0][1] = "error";
    await assert.rejects(async () => atomicWrite(file, validate(invalid)));
    assert.deepEqual(JSON.parse(await fs.readFile(file, "utf8")), original);
    const revised = fixture();
    revised.visualizacao.series[0].dados[0][1] = 1.2;
    await atomicWrite(file, validate(revised));
    assert.equal(
      JSON.parse(await fs.readFile(file, "utf8")).visualizacao.series[0]
        .dados[0][1],
      1.2,
    );
    assert.deepEqual(await fs.readdir(dir), ["snapshot.json"]);
  } finally {
    await fs.rm(file, { force: true });
    await fs.rmdir(dir);
  }
});

test("schema rejects missing UI metadata and incorrect temporal granularity", () => {
  const a = fixture();
  delete a.categoria;
  assert.throws(() => validate(a), /Categoria/);
  const b = fixture();
  b.provenance.frequency = "annual";
  assert.throws(() => validate(b), /frequência/);
  const c = fixture();
  c.provenance.retrievedAt = "2026-13-01";
  assert.throws(() => validate(c), /Data de publicação/);
});
test("reviewed files preserve life-table extraction and consolidated PRODES revision", async () => {
  const read = async (p) =>
    JSON.parse(
      (await fs.readFile(new URL(p, import.meta.url), "utf8")).replace(
        /^\uFEFF/,
        "",
      ),
    );
  const life = await read(
    "../public/data/indicators/saude-expectativa-vida.json",
  );
  assert.deepEqual(
    life.visualizacao.series,
    await read("../data/official-files/life-series.json"),
  );
  const forest = await read(
    "../public/data/indicators/meio-ambiente-desmatamento-amazonia.json",
  );
  assert.deepEqual(forest.visualizacao.series[0].dados.at(-1), ["2025", 5731]);
  assert.equal(forest.provenance.stateReference, "2024");
  assert.equal(
    forest.visualizacao.dados_uf.reduce((sum, x) => sum + x.valor, 0),
    6518,
  );
  assert.equal(forest.provenance.expectedStates, 9);
});

test("FBSP 2026 extraction preserves revised series and 2025 UF ranking", async () => {
  const read = async (p) =>
    JSON.parse(
      (await fs.readFile(new URL(p, import.meta.url), "utf8")).replace(
        /^\uFEFF/,
        "",
      ),
    );
  const extracted = await read("../data/official-files/fbsp-series.json");
  const mvi = await read("../public/data/indicators/seguranca-taxa-mvi.json");
  const fem = await read(
    "../public/data/indicators/seguranca-feminicidios.json",
  );
  assert.deepEqual(mvi.visualizacao.series[0].dados, extracted.mvi);
  assert.deepEqual(mvi.visualizacao.dados_uf, extracted.states);
  assert.deepEqual(fem.visualizacao.series[0].dados, extracted.feminicides);
  assert.deepEqual(extracted.mvi.at(-1), ["2025", 19.1]);
  assert.deepEqual(extracted.feminicides.at(-1), ["2025", 1571]);
  assert.equal(extracted.states.length, 27);
  assert.equal(mvi.provenance.stateReference, "2025");
});

test("CPI source revision corrects both 2024 and 2025", async () => {
  const d = JSON.parse(
    await fs.readFile(
      new URL(
        "../public/data/indicators/internacional-percepcao-corrupcao.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.deepEqual(d.visualizacao.series[0].dados.slice(-2), [
    ["2024", 34],
    ["2025", 35],
  ]);
  assert.equal(d.provenance.organizationType, "civil");
  assert.throws(() => parseCpiBrazil(""), /inválida/);
});

test("BEN 2026 extraction keeps only comparable electricity-supply values", async () => {
  const series = JSON.parse(
    await fs.readFile(
      new URL("../data/official-files/ben-series.json", import.meta.url),
      "utf8",
    ),
  );
  const d = JSON.parse(
    await fs.readFile(
      new URL(
        "../public/data/indicators/meio-ambiente-matriz-eletrica-renovavel.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.deepEqual(d.visualizacao.series[0].dados, series);
  assert.deepEqual(series, [
    ["2023", 89.2],
    ["2024", 88.2],
    ["2025", 86.8],
  ]);
  assert.match(d.provenance.datasetCode, /BEN 2026/);
});

test("archived official PDFs retain the hashes recorded during review", async () => {
  const manifest = JSON.parse(
    await fs.readFile(
      new URL("../data/official-files/manifest.json", import.meta.url),
      "utf8",
    ),
  );
  for (const entry of manifest.files) {
    const bytes = await fs.readFile(
      new URL("../data/official-files/" + entry.file, import.meta.url),
    );
    assert.equal(
      crypto.createHash("sha256").update(bytes).digest("hex"),
      entry.sha256,
      entry.file,
    );
  }
});

test("INPE reference-satellite series excludes partial years and reconciles annual totals", async () => {
  const evidence = JSON.parse(
    await fs.readFile(
      new URL(
        "../data/evidence/meio-ambiente-queimadas-focos.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const original = evidence.responses[0];
  const result = parseInpeFires(original, 2025);
  assert.deepEqual(result.points.at(-2), ["2024", 278299]);
  assert.deepEqual(result.points.at(-1), ["2025", 136393]);
  assert.equal(result.states.size, 27);
  assert.equal(result.points[0][0], "2013");
  const broken = structuredClone(original);
  broken.historico_mensal.find((row) => row.ano === 2025).meses["1"] = null;
  assert.throws(() => parseInpeFires(broken, 2025), /incompleto/);
});
