// @flow
import { kebabCase } from "lodash"

export function makeAreaSlug(name: string): string {
  return kebabCase((name || "").replace(/'/g, "")).toLowerCase()
}
