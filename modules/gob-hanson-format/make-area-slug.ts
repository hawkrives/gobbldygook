import kebabCase from "lodash/kebabCase.js"
export function makeAreaSlug(name: string): string {
  return kebabCase((name || "").replace(/'/g, "")).toLowerCase()
}
