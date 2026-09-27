import test from "node:test";
import assert from "node:assert/strict";
import {
  queryData,
  rangeFor,
  mergeReason,
  csvFor,
  matches,
  formatNumber,
} from "../src/lib/query.ts";
test("formatting preserves the published precision of Gini and exchange rates", () => {
  assert.equal(formatNumber(0.511), "0,511");
  assert.equal(formatNumber(5.1347), "5,1347");
});
const data = (overrides = {}) => ({
  id: "a",
  titulo: "Renda",
  visualizacao: {
    tipo_padrao: "line",
    eixo_y: { unidade: "R$" },
    series: [
      {
        id: "a",
        nome: "Brasil",
        dados: [
          ["2020", 10],
          ["2022", 12],
          ["2026", 14],
        ],
      },
    ],
  },
  provenance: {
    status: "verified",
    sourceUrl: "https://example.org",
    reference: "2026",
    frequency: "annual",
  },
  ...overrides,
});
test("five and ten year windows follow the actual latest data", () => {
  assert.deepEqual(rangeFor([data()], "5"), [2022, 2026]);
  assert.deepEqual(rangeFor([data()], "10"), [2017, 2026]);
  assert.equal(rangeFor([data()], "all"), undefined);
  assert.equal(rangeFor([], "5"), undefined);
});
test("gaps remain null and the same filtered query feeds table and CSV", () => {
  const q = queryData(data(), "nacional", [2020, 2022]);
  assert.deepEqual(q.rows, [
    { period: "2020", values: [10] },
    { period: "2021", values: [null] },
    { period: "2022", values: [12] },
  ]);
  const csv = csvFor(q);
  assert.match(csv, /"2021";"";/);
  assert.match(csv, /"2022";"12";/);
  assert.doesNotMatch(csv, /2026/);
  assert.match(csv, /https:\/\/example.org/);
  assert.match(csv, /Extração conferida/);
});
test("monthly and quarterly series retain their exact reference and missing periods", () => {
  for (const [frequency, points, expected] of [
    [
      "monthly",
      [
        ["2024-01", 1],
        ["2024-03", 3],
      ],
      "2024-02",
    ],
    [
      "quarterly",
      [
        ["2024-Q1", 1],
        ["2024-Q3", 3],
      ],
      "2024-Q2",
    ],
  ]) {
    const d = data();
    d.provenance.frequency = frequency;
    d.visualizacao.series[0].dados = points;
    assert.deepEqual(queryData(d, "nacional").rows[1], {
      period: expected,
      values: [null],
    });
  }
});
test("UF rankings require a documented reference and never turn absence into zero", () => {
  const d = data();
  d.visualizacao.dados_uf = [
    { uf: "SP", nome: "São Paulo", valor: 12 },
    { uf: "RJ", nome: "Rio de Janeiro", valor: null },
  ];
  assert.equal(queryData(d, "estados").rows.length, 0);
  d.provenance.stateReference = "2020";
  assert.equal(queryData(d, "estados", [2022, 2026]).rows.length, 0);
  assert.equal(queryData(d, "estados").rows[1].values[0], null);
});
test("merge validates geography, frequency, confidence, units and current window overlap", () => {
  const a = data(),
    b = data();
  const items = () => [
    { data: a, scope: "nacional" },
    { data: b, scope: "nacional" },
  ];
  assert.equal(mergeReason(items()), null);
  assert.match(
    mergeReason([{ data: a, scope: "estados" }, items()[1]]),
    /nacionais/,
  );
  b.provenance.frequency = "monthly";
  assert.match(mergeReason(items()), /frequências/);
  b.provenance.frequency = "annual";
  b.provenance.status = "review";
  assert.match(mergeReason(items()), /conferidos/);
  b.provenance.status = "verified";
  b.visualizacao.series[0].dados = [["2020", 3]];
  assert.match(mergeReason(items(), [2022, 2026]), /períodos/);
  b.visualizacao.eixo_y.unidade = "%";
  const c = data();
  c.visualizacao.eixo_y.unidade = "pessoas";
  assert.match(
    mergeReason([...items(), { data: c, scope: "nacional" }]),
    /duas unidades/,
  );
});
test("CSV escapes quotes, decimal commas and keeps review warnings", () => {
  const q = queryData(data(), "nacional");
  q.columns[0].name = 'Brasil "total"';
  q.rows = [{ period: "2026", values: [2.5] }];
  q.auditStatus = "Valores legados em revisão";
  assert.match(csvFor(q), /Brasil ""total""/);
  assert.match(csvFor(q), /"2,5"/);
  assert.match(csvFor(q), /em revisão/);
});
test("search tolerates accents and editorial synonyms", () => {
  const entry = {
    titulo: "Índice de preços — IPCA",
    source: "IBGE",
    summary: "",
    tags: [],
  };
  assert.equal(matches(entry, "indice precos"), true);
  assert.equal(matches(entry, "inflação"), true);
  assert.equal(matches(entry, "emprego"), false);
});

test("national and regional histories cannot be merged as equivalent geography", () => {
  const a = data(),
    b = data();
  b.provenance.geography = "Amazônia Legal";
  assert.match(
    mergeReason([
      { data: a, scope: "nacional" },
      { data: b, scope: "nacional" },
    ]),
    /territoriais/,
  );
});
