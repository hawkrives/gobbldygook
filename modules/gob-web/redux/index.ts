// The bundler replaces NODE_ENV, so only one of these is bundled
const { default: configureStore } =
  process.env.NODE_ENV === "production"
    ? await import("./index-production.ts")
    : await import("./index-development.ts")

export default configureStore
