// stabilize@1 is json-stable-stringify under another name, and ships no types.
declare module "stabilize" {
  type Options = {
    space?: string | number
    cycles?: boolean
    cmp?: (
      a: { key: string; value: unknown },
      b: { key: string; value: unknown },
    ) => number
    replacer?: (key: string, value: unknown) => unknown
  }

  // Like JSON.stringify, with object keys sorted. Returns undefined for
  // values JSON can't represent, such as undefined itself.
  export default function stabilize(
    value: unknown,
    options?: Options | Options["cmp"],
  ): string | undefined
}
