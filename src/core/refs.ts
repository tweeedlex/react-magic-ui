import type React from "react";
import { useCallback } from "react";

/** Writes `value` into a callback or object ref. */
export function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as React.MutableRefObject<T>).current = value;
}

/** One callback ref that feeds both refs, e.g. a local one and a forwarded one. */
export function useMergedRef<T>(a: React.Ref<T> | undefined, b: React.Ref<T> | undefined) {
  return useCallback(
    (node: T) => {
      setRef(a, node);
      setRef(b, node);
    },
    [a, b],
  );
}
