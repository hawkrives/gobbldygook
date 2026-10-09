// Compile-time constants injected by webpack's DefinePlugin and Jest's
// `globals` config.

declare var VERSION: string
declare var TESTING: boolean
declare var DEVELOPMENT: boolean
declare var PRODUCTION: boolean
declare var APP_BASE: string

// The environment variables the code reads. Webpack's DefinePlugin replaces
// `process.env.NODE_ENV` at build time.
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string
    TRAVIS_COMMIT?: string
  }
}
