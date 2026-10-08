type Replacer =
  | Array<string | number>
  | ((key: string, value: unknown) => unknown)

export function stringifyError(
  err: object,
  filter?: Replacer,
  space?: string | number,
): string {
  const plainObject: Record<string, unknown> = {}
  Object.getOwnPropertyNames(err).forEach((key) => {
    plainObject[key] = Reflect.get(err, key)
  })
  // JSON.stringify's overloads take the two replacer kinds separately.
  return typeof filter === "function"
    ? JSON.stringify(plainObject, filter, space)
    : JSON.stringify(plainObject, filter, space)
}
