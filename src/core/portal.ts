import { useSyncExternalStore } from "react";

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

/**
 * Copies the theme and ink tone of `anchor`'s ancestors onto `target`, a portal
 * wrapper. For portals without an anchor element of their own (Modal, Toast):
 * they render a hidden anchor in place and sync the wrapper from it.
 */
export function syncGlassContext(target: HTMLElement, anchor: Element | null) {
  const ctx = inheritedGlassContext(anchor);
  target.classList.toggle("dark", ctx.className === "dark");
  if (ctx["data-glass-tone"]) target.setAttribute("data-glass-tone", ctx["data-glass-tone"]);
  else target.removeAttribute("data-glass-tone");
}

const noopSubscribe = () => () => {};

/** `false` on the server and during hydration, `true` on the client: portals need `document`. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
