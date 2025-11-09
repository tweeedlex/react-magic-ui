import { expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
}
expect.extend(matchers);

vi.mock("react-dom/test-utils", async () => {
  const actual = await vi.importActual<
    typeof import("react-dom/test-utils")
  >("react-dom/test-utils");

  return {
    ...actual,
    act: (callback: () => unknown | Promise<unknown>) => {
      const result = callback();
      if (result && typeof (result as Promise<unknown>).then === "function") {
        return (result as Promise<unknown>).then(() => undefined);
      }
      return undefined;
    },
  };
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;