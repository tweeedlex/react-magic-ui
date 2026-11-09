/**
 * Floating glass has to be portalled out of other glass: a backdrop-filter
 * inside another one only samples its parent, not the page. The portal loses
 * the ancestors that set the theme and the ink tone, so read them from the
 * anchor and put them back on the portal wrapper.
 */
export function inheritedGlassContext(anchor: Element | null): {
  className?: string;
  "data-glass-tone"?: string;
} {
  if (!anchor) return {};
  const dark = anchor.closest(".dark, [data-theme='dark']");
  const light = anchor.closest(".light, [data-theme='light']");
  // the nearest of the two wins: dark counts if it sits inside the light one
  const isDark = !!dark && (!light || light.contains(dark));
  const toneEl = anchor.closest("[data-glass-tone]");
  const tone = toneEl?.getAttribute("data-glass-tone") ?? undefined;
  return {
    className: isDark ? "dark" : undefined,
    "data-glass-tone": tone,
  };
}
