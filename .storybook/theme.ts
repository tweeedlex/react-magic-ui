import { create } from "storybook/theming";

const font =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter Variable", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif';

/** Dark, quiet chrome so the glass in the canvas is the only thing that shines. */
export default create({
  base: "dark",
  brandTitle: "react-magic-ui",
  brandUrl: "https://www.npmjs.com/package/react-magic-ui",
  brandTarget: "_blank",

  fontBase: font,
  fontCode: 'ui-monospace, "SF Mono", "JetBrains Mono", "Cascadia Code", Menlo, Consolas, monospace',

  colorPrimary: "#0a84ff",
  colorSecondary: "#0a84ff",

  appBg: "#0e0f13",
  appContentBg: "#15161b",
  appPreviewBg: "#15161b",
  appBorderColor: "rgba(255, 255, 255, 0.08)",
  appBorderRadius: 12,

  textColor: "#f2f2f7",
  textInverseColor: "#000000",
  textMutedColor: "#98989f",

  barBg: "#15161b",
  barTextColor: "#aeaeb2",
  barSelectedColor: "#0a84ff",
  barHoverColor: "#64d2ff",

  buttonBg: "#1f2026",
  buttonBorder: "rgba(255, 255, 255, 0.1)",
  booleanBg: "#1f2026",
  booleanSelectedBg: "#0a84ff",
  inputBg: "#1f2026",
  inputBorder: "rgba(255, 255, 255, 0.1)",
  inputTextColor: "#f2f2f7",
  inputBorderRadius: 8,
});
