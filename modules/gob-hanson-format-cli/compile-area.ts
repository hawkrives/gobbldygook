import getStdin from "get-stdin"
import yaml from "js-yaml"
import { enhanceHanson } from "@gob/hanson-format"
import type { HansonFile, ParsedHansonFile } from "@gob/hanson-format"

function compileArea(data: string): ParsedHansonFile {
  // enhanceHanson checks the shape of the area itself
  let obj = yaml.safeLoad(data) as HansonFile
  return enhanceHanson(obj)
}

export function cli() {
  getStdin()
    .then((data) => {
      let area = compileArea(data)
      console.log(JSON.stringify(area, null, 2))
    })
    .catch((err: unknown) => {
      console.error(err)
      process.exitCode = 1
    })
}
