import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import pkg from "./package.json" with { type: "json" }

export default defineConfig({
  // files in static/ are copied into the build as-is
  publicDir: "static",
  plugins: [react()],
  define: {
    // some dependencies (treo, present, lodash) read Node's `global`, which
    // webpack used to provide
    global: "globalThis",
    VERSION: JSON.stringify(pkg.version),
    // the base URL the app is served from; the data index files sit next
    // to index.html
    APP_BASE: JSON.stringify("/"),
    "process.env.TRAVIS_COMMIT": JSON.stringify(
      process.env["TRAVIS_COMMIT"] ?? process.env["COMMIT_REF"],
    ),
  },
  resolve: {
    alias: [
      // js-yaml's "full" and "safe" schemas bring in esprima to support the
      // !!js/function type, which we don't need, so both load the core
      // schema instead
      {
        find: /^(.*)\/schema\/default_(?:full|safe)$/,
        replacement: "$1/schema/core",
      },
    ],
  },
  worker: {
    format: "es",
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: true,
    assetsInlineLimit: 10000,
  },
  server: {
    port: 3000,
  },
})
