import every from "lodash/every.js"

export function compareProps(
  oldProps: Readonly<Record<string, unknown>>,
  newProps: Readonly<Record<string, unknown>>,
): boolean {
  return !every(
    oldProps,
    (_: unknown, key: string) => oldProps[key] === newProps[key],
  )
}
