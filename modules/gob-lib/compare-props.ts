import every from "lodash/every"

export function compareProps(
  oldProps: Record<string, any>,
  newProps: Record<string, any>,
): boolean {
  return !every(
    oldProps,
    (_: unknown, key: string) => oldProps[key] === newProps[key],
  )
}
