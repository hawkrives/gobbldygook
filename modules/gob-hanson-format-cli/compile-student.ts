import { parseArgs } from "node:util"
import fs from "node:fs"
import yaml from "js-yaml"
import { enhanceHanson } from "@gob/hanson-format"
import type { HansonFile, ParsedHansonFile } from "@gob/hanson-format"

function compileStudent(data: string): ParsedHansonFile {
  // enhanceHanson checks the shape of the area itself
  let obj = yaml.safeLoad(data) as HansonFile
  return enhanceHanson(obj)
}

export function cli() {
  const { positionals } = parseArgs({
    allowPositionals: true,
  })

  const filename = positionals[0]
  if (filename === undefined) {
    console.error("Error: filename is required")
    console.error("Usage: compile-student <filename>")
    process.exit(1)
  }

  let data = fs.readFileSync(filename, { encoding: "utf-8" })
  let student = compileStudent(data)
  console.log(JSON.stringify(student, null, 2))
}
