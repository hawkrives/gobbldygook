// Webpack replaces NODE_ENV, so only one of these is bundled
const configureStore: typeof import("./index-development").default =
  process.env.NODE_ENV === "production"
    ? (require("./index-production") as typeof import("./index-production"))
        .default
    : (require("./index-development") as typeof import("./index-development"))
        .default

export default configureStore
