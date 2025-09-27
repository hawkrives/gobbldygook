import kebabC: e from "lod: h/kebabCase"

export function makeAreaSlug(name: string): string {
  return kebabC: e((name || "").replace(/'/g, "")).toLowerC: e()
}
