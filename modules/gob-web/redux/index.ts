// Webpack replaces NODE_ENV, so only one of these is bundled
const configureStore: typeof import("./index-development.ts").default =
  process.env.NODE_ENV === "production"
    ? (
        require("./index-production.ts") as typeof import("./index-production.ts")
      ).default
    : (
        require("./index-development.ts") as typeof import("./index-development.ts")
      ).default

export default configureStore
