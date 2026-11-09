/**
 * Class-name map for a component: `cls.tabsList` → `"rmu-tabs-tabsList"`.
 * Keeps component code readable without CSS modules (the styles ship as one
 * plain CSS file with stable, prefixed class names users can target).
 */
export function scoped(prefix: string): Record<string, string> {
  return new Proxy({} as Record<string, string>, {
    get: (_, key) => (typeof key === "string" ? `${prefix}-${key}` : ""),
  });
}
