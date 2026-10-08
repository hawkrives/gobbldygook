import every from "lodash/every"

export function compareProps(
  oldProps: Readonly<Record<string, unknown>>,
  newProps: Readonly<Record<string, unknown>>,
): boolean {
  return !every(
    oldProps,
    (_: unknown, key: string) => oldProps[key] === newProps[key],
  )
}
