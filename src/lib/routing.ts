import type { Card, Preset } from "./model.ts";

export function detailRoute(slug: string, card: Card, preset: Preset): string {
  const query = new URLSearchParams({ period: preset, scope: card.scope });
  if (card.display) query.set("display", card.display);
  return `/indicador/${slug}?${query}`;
}

export function detailOptions(route: string) {
  const query = new URLSearchParams(route.split("?")[1]);
  const period = query.get("period");
  const display = query.get("display");
  return {
    preset: (["5", "10", "all"].includes(period ?? "") ? period : undefined) as
      Preset | undefined,
    scope:
      query.get("scope") === "estados"
        ? ("estados" as const)
        : ("nacional" as const),
    display: (["line", "bar", "smooth", "area"].includes(display ?? "")
      ? display
      : undefined) as Card["display"],
  };
}
