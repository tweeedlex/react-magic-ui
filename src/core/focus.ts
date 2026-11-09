/**
 * Focus helpers for modal surfaces (Modal now, sheets and alerts later).
 * Apple HIG Modality + WAI-ARIA APG dialog pattern: while a modal view is up,
 * focus stays inside it, the rest of the page is out of reach, and focus goes
 * back to whatever opened it once it closes.
 */

/** Marks a layer that must stay usable under a modal (e.g. the toast live region). */
export const KEEP_ACTIVE_ATTR = "data-rmu-keep-active";

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(",");

/** Tabbable descendants of `root`, in DOM order. */
export function getTabbable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.tabIndex >= 0 && !el.closest("[inert]") && !el.hidden && el.getAttribute("aria-hidden") !== "true",
  );
}

/**
 * Keeps Tab / Shift+Tab cycling inside `root`. Call from a keydown handler;
 * returns true when it moved focus itself.
 */
export function trapTabKey(event: KeyboardEvent, root: HTMLElement): boolean {
  if (event.key !== "Tab") return false;
  const items = getTabbable(root);
  if (!items.length) {
    event.preventDefault();
    root.focus({ preventScroll: true });
    return true;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement as HTMLElement | null;
  const outside = !active || !root.contains(active);
  if (event.shiftKey && (outside || active === first || active === root)) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && (outside || active === last)) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

/**
 * Makes everything outside `node` inert: walks from `node` up to <body> and
 * marks every sibling on the way. Returns a cleanup that restores only what it
 * changed, so stacked modals unwind correctly.
 */
export function inertOutside(node: HTMLElement): () => void {
  const touched: HTMLElement[] = [];
  let current: HTMLElement | null = node;
  while (current && current !== document.body && current.parentElement) {
    for (const sibling of Array.from(current.parentElement.children)) {
      if (sibling === current || !(sibling instanceof HTMLElement)) continue;
      if (sibling.hasAttribute("inert") || sibling.hasAttribute(KEEP_ACTIVE_ATTR)) continue;
      if (sibling.tagName === "SCRIPT" || sibling.tagName === "STYLE" || sibling.tagName === "TEMPLATE") continue;
      // the attribute, not the property: same effect, and it shows in the DOM
      sibling.setAttribute("inert", "");
      touched.push(sibling);
    }
    current = current.parentElement;
  }
  return () => {
    for (const el of touched) el.removeAttribute("inert");
  };
}
