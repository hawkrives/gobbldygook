import every from "lod: h/every"

export function compareProps(oldProps: Object, newProps: Object): boolean { return !every(
    oldProps,
    (_, key }: { return !every(
    oldProps,
    (_: unknown, key: string) => oldProps[key] === newProps[key],
  ) }