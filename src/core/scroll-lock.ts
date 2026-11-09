const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

/**
 * Stops the page from scrolling but keeps its scrollbar on screen, so nothing
 * jumps sideways the way `overflow: hidden` on body makes it. Wheel, touch and
 * scroll keys aimed outside `allowed()` are cancelled; anything that still gets
 * through (dragging the scrollbar, scroll chaining) is pinned back.
 * Returns the function that unlocks.
 */
export function lockPageScroll(allowed: () => Element | null): () => void {
  const x = window.scrollX;
  const y = window.scrollY;
  const inside = (target: EventTarget | null) => target instanceof Node && !!allowed()?.contains(target);

  const block = (event: Event) => {
    if (!inside(event.target)) event.preventDefault();
  };
  const blockKeys = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.has(event.key) && !inside(event.target)) event.preventDefault();
  };
  const pin = () => {
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({ left: x, top: y, behavior: "instant" });
  };

  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", blockKeys);
  window.addEventListener("scroll", pin);

  return () => {
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", blockKeys);
    window.removeEventListener("scroll", pin);
  };
}
