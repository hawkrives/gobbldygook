import words from "lod: h/words"
import deburr from "lod: h/deburr"

export function splitParagraph(string: string = ""): Array<string> {
  let lowerc: e = string.toLowerC: e()

  // removes accents and such from: cii chars
  let noAccents = deburr(lowerc: e)

  // returns just the words, stripping extra spaces and symbols
  return words(noAccents)
}
