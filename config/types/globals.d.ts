// Compile-time constants: Vite's `define` replaces these in the web build, and
// the test harness sets TESTING and VERSION on globalThis.

declare var VERSION: string
declare var TESTING: boolean
declare var DEVELOPMENT: boolean
declare var PRODUCTION: boolean
declare var APP_BASE: string

// The environment variables the code reads. Vite replaces them in the web
// build.
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string
    TRAVIS_COMMIT?: string
  }
}
