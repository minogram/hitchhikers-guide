export type CatalogSearchApp = {
  title: string;
  description: string;
};

export function normalizeCatalogSearchText(value: string): string {
  return value.normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
}

export function matchesCatalogSearch(app: CatalogSearchApp, query: string): boolean {
  const normalizedQuery = normalizeCatalogSearchText(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [app.title, app.description]
    .map((field) => normalizeCatalogSearchText(field))
    .join("\n");

  return searchableText.includes(normalizedQuery);
}