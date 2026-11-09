import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import { rmSync } from "fs";
import { join } from "path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { dependencies, peerDependencies } = require('./package.json')

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "react-magic-ui",
      fileName: (format) => `index.${format}.js`,
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: (id: string) => [...Object.keys(dependencies), ...Object.keys(peerDependencies)].some((dep) => id === dep || id.startsWith(`${dep}/`)),
      // every component uses hooks: mark the bundle as client code for React Server Components (Next.js app router)
      output: { banner: '"use client";' },
    },
    sourcemap: true,
    emptyOutDir: true,
    cssCodeSplit: false,
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/__docs__', 'src/**/__test__', '**/*.test.ts', '**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'],
      rollupTypes: true,
      copyDtsFiles: false,
      insertTypesEntry: true,
    }),
    {
      name: 'remove-demo-assets',
      closeBundle() {
        try {
          for (const name of ['demo.png', 'demo.jpg']) {
            rmSync(join(process.cwd(), 'dist', 'assets', name), { force: true });
          }
        } catch { /* empty */ }
      },
    },
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
  },
});