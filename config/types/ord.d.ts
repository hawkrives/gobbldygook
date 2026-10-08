// ord@1 ships no types.
declare module "ord" {
  // The ordinal suffix for a positive integer, like 2 => "nd". Anything else
  // gives "".
  export default function ord(n: number): "" | "st" | "nd" | "rd" | "th"
}
