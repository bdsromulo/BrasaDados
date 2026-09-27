import test from "node:test";
import assert from "node:assert/strict";
import {
  initialPanel,
  panelReducer as reduce,
  decodePanel,
  serializable,
} from "../src/lib/panel.ts";
import { detailOptions, detailRoute } from "../src/lib/routing.ts";

const panel = (...ids) =>
  ids.reduce(
    (s, indicatorId) => reduce(s, { type: "add", indicatorId }),
    initialPanel,
  );
test("fifth addition waits for explicit replacement and cancellation loses nothing", () => {
  const four = panel("a", "b", "c", "d");
  const pending = reduce(four, { type: "add", indicatorId: "e" });
  assert.deepEqual(pending.cards, four.cards);
  assert.equal(pending.pendingId, "e");
  assert.deepEqual(
    reduce(pending, { type: "cancel-pending" }).cards,
    four.cards,
  );
});
test("duplicate activates the existing card without overwriting preferences", () => {
  let s = reduce(panel("a", "b"), {
    type: "configure",
    cardId: "card-a",
    display: "area",
    scope: "estados",
  });
  s = reduce(s, { type: "focus", cardId: "card-b" });
  s = reduce(s, { type: "add", indicatorId: "a" });
  assert.equal(s.cards.length, 2);
  assert.equal(s.focusedId, "card-a");
  assert.equal(s.cards[0].display, "area");
  assert.equal(s.cards[0].scope, "estados");
});
test("removal compacts the panel and undo restores cards and focus", () => {
  const s = reduce(panel("a", "b", "c"), { type: "focus", cardId: "card-b" });
  const removed = reduce(s, { type: "remove", cardId: "card-b" });
  assert.deepEqual(
    removed.cards.map((c) => c.indicatorId),
    ["a", "c"],
  );
  assert.equal(removed.focusedId, null);
  const undone = reduce(removed, { type: "undo" });
  assert.deepEqual(undone.cards, s.cards);
  assert.equal(undone.focusedId, "card-b");
});
test("replacement resets per-indicator settings and undo restores them", () => {
  const s = reduce(panel("a"), {
    type: "configure",
    cardId: "card-a",
    scope: "estados",
    display: "bar",
  });
  const replaced = reduce(s, {
    type: "replace",
    cardId: "card-a",
    indicatorId: "b",
  });
  assert.equal(replaced.cards[0].id, s.cards[0].id);
  assert.equal(replaced.cards[0].display, undefined);
  assert.equal(replaced.cards[0].scope, "nacional");
  assert.deepEqual(reduce(replaced, { type: "undo" }).cards, s.cards);
});
test("re-adding an indicator after replacement never duplicates a card identifier", () => {
  const replaced = reduce(panel("a"), {
    type: "replace",
    cardId: "card-a",
    indicatorId: "b",
  });
  const added = reduce(replaced, { type: "add", indicatorId: "a" });
  assert.equal(new Set(added.cards.map((c) => c.id)).size, 2);
  assert.deepEqual(reduce(added, { type: "undo" }).cards, added.cards);
});
test("maximizing and merging preserve independent visual preferences", () => {
  let s = reduce(panel("a", "b"), {
    type: "configure",
    cardId: "card-a",
    display: "bar",
  });
  const cards = s.cards;
  s = reduce(s, { type: "focus", cardId: "card-a" });
  s = reduce(s, { type: "merge", value: true });
  s = reduce(s, { type: "merge", value: false });
  assert.deepEqual(s.cards, cards);
  assert.equal(s.cards[1].display, undefined);
});
test("sharing and storage sanitize invalid input while retaining valid settings", () => {
  const ids = new Set(["a", "b", "c", "d", "e"]);
  for (const raw of ["", "null", "[]", "{}", "{bad"])
    assert.deepEqual(decodePanel(raw, ids).cards, []);
  const raw = JSON.stringify({
    version: 1,
    preset: "all",
    cards: [
      { indicatorId: "a", scope: "estados", display: "area" },
      { indicatorId: "a" },
      { indicatorId: "unknown" },
      { indicatorId: "b", display: "script" },
    ],
  });
  const decoded = decodePanel(raw, ids);
  assert.equal(decoded.cards.length, 2);
  assert.equal(decoded.cards[0].display, "area");
  assert.equal(decoded.cards[1].display, undefined);
  assert.deepEqual(
    decodePanel(JSON.stringify(serializable(decoded)), ids).cards,
    decoded.cards,
  );
});
test("shared indicator preserves its period, scope and chosen display", () => {
  const route = detailRoute(
    "renda",
    { id: "detail-a", indicatorId: "a", scope: "estados", display: "bar" },
    "all",
  );
  assert.deepEqual(detailOptions(route), {
    preset: "all",
    scope: "estados",
    display: "bar",
  });
  assert.deepEqual(
    detailOptions("/indicador/renda?period=0&scope=xyz&display=evil"),
    { preset: undefined, scope: "nacional", display: undefined },
  );
});
test("adding the mobile detail carries its visual and geographic filters", () => {
  const s = reduce(initialPanel, {
    type: "add",
    indicatorId: "a",
    display: "area",
    scope: "estados",
  });
  assert.equal(s.cards[0].display, "area");
  assert.equal(s.cards[0].scope, "estados");
});
