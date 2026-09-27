import type { CatalogEntry, Dataset } from "./model";

const base = import.meta.env.BASE_URL;
const cache = new Map<string, Promise<Dataset>>();
export async function loadCatalog(): Promise<CatalogEntry[]> {
  const r = await fetch(`${base}data/catalog.json`);
  if (!r.ok)
    throw new Error("Não foi possível carregar o catálogo. Tente novamente.");
  return r.json();
}
export function loadDataset(id: string): Promise<Dataset> {
  if (!/^[a-z0-9-]+$/.test(id))
    return Promise.reject(new Error("Indicador inválido."));
  if (!cache.has(id))
    cache.set(
      id,
      fetch(`${base}data/indicators/${id}.json`)
        .then(async (r) => {
          if (!r.ok)
            throw new Error("Não foi possível carregar este indicador.");
          return r.json();
        })
        .catch((e) => {
          cache.delete(id);
          throw e;
        }),
    );
  return cache.get(id)!;
}
