import type { Panel, Card, Display, Scope, Preset } from "./model.ts";

export const initialPanel: Panel = {
  cards: [],
  activeId: null,
  focusedId: null,
  merged: false,
  preset: "10",
  pendingId: null,
  undo: null,
  notice: "",
};
export type Action =
  | { type: "add"; indicatorId: string; display?: Display; scope?: Scope }
  | { type: "add-group"; indicatorIds: string[] }
  | { type: "replace"; cardId: string; indicatorId: string }
  | { type: "remove" | "activate" | "focus"; cardId: string }
  | {
      type: "configure";
      cardId: string;
      display?: Display;
      scope?: Scope;
      reset?: boolean;
    }
  | { type: "preset"; preset: Preset }
  | { type: "merge"; value: boolean }
  | { type: "restore"; panel: Panel }
  | { type: "undo" | "cancel-pending" | "dismiss" };

function snapshot(s: Panel) {
  return {
    cards: s.cards.map((c) => ({ ...c })),
    activeId: s.activeId,
    focusedId: s.focusedId,
    merged: s.merged,
  };
}
export function panelReducer(s: Panel, a: Action): Panel {
  switch (a.type) {
    case "add-group": {
      const ids = [...new Set(a.indicatorIds)];
      const missing = ids.filter(
        (id) => !s.cards.some((c) => c.indicatorId === id),
      );
      if (!missing.length)
        return { ...s, notice: "Estes indicadores já estão no painel." };
      if (s.cards.length + missing.length > 4)
        return {
          ...s,
          notice:
            "Não há espaço para esta sugestão. Remova um gráfico ou escolha qual substituir.",
        };
      const cards = [...s.cards];
      for (const indicatorId of missing) {
        let id = `card-${indicatorId}`;
        for (let suffix = 2; cards.some((c) => c.id === id); suffix++)
          id = `card-${indicatorId}-${suffix}`;
        cards.push({ id, indicatorId, scope: "nacional" });
      }
      return {
        ...s,
        cards,
        activeId: cards.at(-1)!.id,
        focusedId: null,
        merged: false,
        pendingId: null,
        notice:
          missing.length === 1
            ? "Indicador adicionado ao painel."
            : "Sugestão adicionada ao painel.",
      };
    }
    case "add": {
      const existing = s.cards.find((c) => c.indicatorId === a.indicatorId);
      if (existing)
        return {
          ...s,
          activeId: existing.id,
          focusedId: s.focusedId ? existing.id : null,
          merged: false,
          pendingId: null,
          notice: "Este indicador já está no painel.",
        };
      if (s.cards.length === 4)
        return {
          ...s,
          pendingId: a.indicatorId,
          notice: "Seu painel tem quatro gráficos. Escolha qual substituir.",
        };
      let id = `card-${a.indicatorId}`;
      for (let suffix = 2; s.cards.some((c) => c.id === id); suffix++)
        id = `card-${a.indicatorId}-${suffix}`;
      const card: Card = {
        id,
        indicatorId: a.indicatorId,
        scope: a.scope ?? "nacional",
        display: a.display,
      };
      return {
        ...s,
        cards: [...s.cards, card],
        activeId: card.id,
        focusedId: null,
        merged: false,
        pendingId: null,
        undo: null,
        notice: "Indicador adicionado ao painel.",
      };
    }
    case "replace": {
      if (!s.cards.some((c) => c.id === a.cardId)) return s;
      const existing = s.cards.find((c) => c.indicatorId === a.indicatorId);
      if (existing)
        return {
          ...s,
          activeId: existing.id,
          pendingId: null,
          notice: "Este indicador já está no painel.",
        };
      return {
        ...s,
        undo: snapshot(s),
        cards: s.cards.map((c) =>
          c.id === a.cardId
            ? {
                ...c,
                indicatorId: a.indicatorId,
                display: undefined,
                scope: "nacional",
              }
            : c,
        ),
        activeId: a.cardId,
        merged: false,
        pendingId: null,
        notice: "Gráfico substituído. Você pode desfazer.",
      };
    }
    case "remove": {
      if (!s.cards.some((c) => c.id === a.cardId)) return s;
      const cards = s.cards.filter((c) => c.id !== a.cardId);
      return {
        ...s,
        undo: snapshot(s),
        cards,
        activeId: s.activeId === a.cardId ? (cards[0]?.id ?? null) : s.activeId,
        focusedId: s.focusedId === a.cardId ? null : s.focusedId,
        merged: false,
        notice: "Gráfico removido. Você pode desfazer.",
      };
    }
    case "undo":
      return s.undo
        ? {
            ...s,
            ...s.undo,
            undo: null,
            pendingId: null,
            notice: "Alteração desfeita.",
          }
        : s;
    case "activate":
      return { ...s, activeId: a.cardId };
    case "focus":
      return {
        ...s,
        focusedId: s.focusedId === a.cardId ? null : a.cardId,
        activeId: a.cardId,
        merged: false,
      };
    case "configure":
      return {
        ...s,
        merged: false,
        undo: null,
        cards: s.cards.map((c) =>
          c.id !== a.cardId
            ? c
            : {
                ...c,
                display: a.reset ? undefined : (a.display ?? c.display),
                scope: a.scope ?? c.scope,
              },
        ),
      };
    case "preset":
      return { ...s, preset: a.preset };
    case "merge":
      return { ...s, merged: a.value, focusedId: null };
    case "restore":
      return a.panel;
    case "cancel-pending":
      return { ...s, pendingId: null, notice: "" };
    case "dismiss":
      return { ...s, notice: "", undo: null };
  }
}

export function serializable(s: Panel) {
  return { version: 1, cards: s.cards, preset: s.preset, merged: s.merged };
}
export function decodePanel(raw: string, validIds: Set<string>): Panel {
  try {
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.cards))
      return { ...initialPanel };
    const seen = new Set<string>();
    const cards: Card[] = data.cards.slice(0, 4).flatMap((c: Partial<Card>) => {
      if (
        typeof c?.indicatorId !== "string" ||
        !validIds.has(c.indicatorId) ||
        seen.has(c.indicatorId)
      )
        return [];
      seen.add(c.indicatorId);
      return [
        {
          id: `card-${c.indicatorId}`,
          indicatorId: c.indicatorId,
          scope:
            c.scope === "estados"
              ? ("estados" as const)
              : ("nacional" as const),
          display: ["line", "bar", "smooth", "area"].includes(c.display ?? "")
            ? c.display
            : undefined,
        },
      ];
    });
    return {
      ...initialPanel,
      cards,
      activeId: cards[0]?.id ?? null,
      preset: ["5", "10", "all"].includes(data.preset) ? data.preset : "10",
      merged: data.merged === true && cards.length >= 2,
    };
  } catch {
    return { ...initialPanel };
  }
}
