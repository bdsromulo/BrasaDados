import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  availableRecommendations,
  recommendationError,
  recommendations,
} from "../src/lib/recommendations.ts";
import { mergeReason } from "../src/lib/query.ts";

const read = (path) =>
  JSON.parse(
    readFileSync(new URL(`../public/data/${path}`, import.meta.url), "utf8"),
  );
const catalog = read("catalog.json");
const dataset = (id) => read(`indicators/${id}.json`);

test("editorial recommendations use stable verified IDs instead of alphabetical order", () => {
  assert.deepEqual(
    availableRecommendations(catalog).map((item) => item.id),
    ["prices-rates", "growth-jobs", "start-inflation"],
  );
  const changed = catalog.map((entry) =>
    entry.id === "economia-taxa-selic" ? { ...entry, status: "review" } : entry,
  );
  assert.deepEqual(
    availableRecommendations(changed).map((item) => item.id),
    ["growth-jobs", "start-inflation"],
  );
});

test("IPCA and Selic can merge; PIB and unemployment retain different frequencies", () => {
  const [prices, growth] = recommendations;
  const pricesData = prices.indicatorIds.map(dataset);
  const growthData = growth.indicatorIds.map(dataset);
  assert.equal(recommendationError(prices, pricesData), null);
  assert.equal(
    mergeReason(pricesData.map((data) => ({ data, scope: "nacional" }))),
    null,
  );
  assert.equal(recommendationError(growth, growthData), null);
  assert.match(
    mergeReason(growthData.map((data) => ({ data, scope: "nacional" }))),
    /frequências/,
  );
});

test("recommendation validation rejects unavailable and unverified data", () => {
  const item = recommendations[0];
  const datasets = item.indicatorIds.map(dataset);
  assert.match(recommendationError(item, datasets.slice(0, 1)), /disponíveis/);
  datasets[1].provenance.status = "review";
  assert.match(recommendationError(item, datasets), /disponíveis/);
});
