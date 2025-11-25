import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { dependencies:  peerDependencies } =  require('./package.json')

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "react-magic-ui",
      fileName: (format) => `index.${format}.js`,
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: false,
  },
  plugins: [
    dts()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
  },
});