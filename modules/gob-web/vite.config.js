// @flow
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { readFileSync } from "fs"

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"))

export default defineConfig(({ mode }) => {
  return {
    plugins: [react({ babel: { configFile: "../../babel.config.js" } })],

    // Entry point
    root: ".",
    publicDir: "static",

    // Development server configuration
    server: {
      port: 3000,
      host: true,
      // Enable SPA fallback for client-side routing
      historyApiFallback: true,
      open: false, // Don't auto-open browser
      hmr: {
        port: 24678, // Use a different port for HMR
      },
    },

    // Build configuration
    build: {
      outDir: "build",
      sourcemap: mode === "production",
    },

    // Define global variables (equivalent to webpack DefinePlugin)
    define: {
      VERSION: JSON.stringify(pkg.version),
      APP_BASE: JSON.stringify("/"),
      "process.env.TRAVIS_COMMIT": JSON.stringify(
        process.env.TRAVIS_COMMIT || process.env.COMMIT_REF || "",
      ),
    },

    // Worker configuration
    worker: {
      format: "es",
      plugins: () => [
        react({ babel: { configFile: "../../babel.config.js" } }),
      ],
    },

    // Resolve configuration
    resolve: {
      alias: {
        // Handle js-yaml schema resolution (replaces webpack NormalModuleReplacementPlugin)
        "js-yaml/lib/schema/default_full": "js-yaml/lib/schema/core",
        "js-yaml/lib/schema/default_safe": "js-yaml/lib/schema/core",
      },
    },
  }
})
