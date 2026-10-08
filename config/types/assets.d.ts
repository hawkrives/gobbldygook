// Non-code imports that webpack handles through its loaders.

declare module "*.css"
declare module "*.scss"

declare module "*.png" {
  const url: string
  export default url
}
declare module "*.jpg" {
  const url: string
  export default url
}
declare module "*.svg" {
  const url: string
  export default url
}
declare module "*.woff" {
  const url: string
  export default url
}
declare module "*.woff2" {
  const url: string
  export default url
}
