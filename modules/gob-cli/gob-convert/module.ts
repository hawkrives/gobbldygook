const usage = `
usage: gob-convert < file
outputs the converted file to stdout
`

import meow from "meow"
import { getCourse } from "../lib/get-course"
import { loadJson } from "../lib/load-json"
import { convertStudent } from "@gob/school-st-olaf-college-sis-import"
import type { PartialStudent } from "@gob/school-st-olaf-college-sis-import"
import { version } from "../package.json"

function args() {
  return meow(usage, {
    booleanDefault: false,
  })
}

export default async function main() {
  let { input } = args()

  // SIS exports are trusted to have the shape of a PartialStudent
  let data = (await loadJson(input[0])) as PartialStudent

  let hydrated = await convertStudent(data, getCourse)
  // Student reads its default version when its module loads, which is too
  // early for anything set here, so stamp the CLI's version on directly
  hydrated = hydrated.set("version", version)

  console.log(JSON.stringify(hydrated))
}
