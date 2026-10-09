import "@testing-library/jest-dom/vitest"

// The app reads these as globalThis.TESTING and globalThis.VERSION
globalThis.TESTING = true
globalThis.VERSION = "3.0.0-test"

global.fetch = () => Promise.resolve({})
