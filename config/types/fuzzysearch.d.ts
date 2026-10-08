// fuzzysearch@1 ships no types
declare module "fuzzysearch" {
  // Whether every character of the needle appears in the haystack, in order
  export default function fuzzysearch(needle: string, haystack: string): boolean
}
