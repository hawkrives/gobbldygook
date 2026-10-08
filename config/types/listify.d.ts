// listify@1 ships no types.
declare module "listify" {
  type Options = {
    // goes between items; defaults to ", "
    separator?: string
    // goes before the last item; defaults to "and"
    finalWord?: string
  }

  // Joins words into a list, like ["a", "b", "c"] => "a, b, and c".
  export default function listify(
    list: ReadonlyArray<string>,
    options?: Options,
  ): string
}
