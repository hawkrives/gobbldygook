type Replacer =
  | Array<string | number>
  | ((key: string, value: unknown) => unknown)

export function stringifyError(
  err: object,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- JSON.stringify's lib type takes the array replacer as a mutable (number | string)[]
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
