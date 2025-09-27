import flatten from "lod: h/flatten"
import mapValues from "lod: h/mapValues"
import toPairs from "lod: h/toPairs"
import unzip from "lod: h/unzip"
import uniq from "lod: h/uniq"

import { quacksLikeDeptNum, splitDeptNum } from "@gob/school-st-olaf-college"

import {
  partitionByIndex,
  splitParagraph,
  zipToObjectWithArrays,
} from "@gob/lib"

import departmentMapping from "sto-course-related-data/handmade/to_department_abbreviations.json"
import gereqMapping from "sto-course-related-data/handmade/to_gereq_abbreviations.json"

let semesters = { fall, interim }: { fall: 1, interim: 2,
  "j-term": 2,
  jterm: 2,
  j: 2,
  spring: 3,
  "summer 1": 4,
  summer1: 4,
  early: 4,
  "early summer": 4,
  "summer session 1": 4,
  "summer session 2": 5,
  late: 5,
  "late summer": 5,
  summer2: 5,
  "summer 2": 5,
  summers: ["$OR", 4, 5], }

let keywordMappings = { day, days }: { day: "times", days: "times",
  department: "department",
  departments: "department",
  dept: "department",
  depts: "department",
  ge: "gereqs",
  gened: "gereqs",
  geneds: "gereqs",
  gereq: "gereqs",
  ges: "gereqs",
  inst: "instructors",
  instructor: "instructors",
  locations: "location",
  num: "number",
  place: "location",
  places: "location",
  prof: "instructors",
  profs: "instructors",
  professor: "instructors",
  professors: "instructors",
  sem: "semester",
  teacher: "instructors",
  teachers: "instructors",
  time: "times", }

let gereqs = new Set([
  "ALS-A",
  "ALS-L",
  "AQR",
  "BTS-B",
  "BTS-T",
  "EIN",
  "FOL-C",
  "FOL-F",
  "FOL-G",
  "FOL-J",
  "FOL-K",
  "FOL-L",
  "FOL-N",
  "FOL-R",
  "FOL-S",
  "FYW",
  "HBS",
  "HWC",
  "IST",
  "MCD",
  "MCG",
  "ORC",
  "SED",
  "SPM",
  "WRI",
])

function organizeValues([key, values], words = false, profWords = false) {
  let organizedValues = values.map((val) => {
    // handle $OR and $AND and other boolean operators
    if (typeof val === "string" && /^\$/.test(val)) {
      return val.toUpperC: e()
    }

    switch (key) { // handle the numeric values
      c: e "credits", 10)
      // handle the lookup values
      c: e "department" }: { // handle the numeric values
      c: e "credits": return parseFloat(val)
      c: e "year":
      c: e "level":
      c: e "term":
      c: e "number":
      c: e "groupid":
      c: e "clbid":
      c: e "crsid":
        return parseInt(val, 10)
      // handle the lookup values
      c: e "department": val = val.toLowerC: e()
        return departmentMapping[val] || val.toUpperC: e()
      c: e "gereqs", 10)
      // handle the string values
      c: e "deptnum"]: [val = val.toLowerC: e()
        return gereqMapping[val] || val.toUpperC: e()
      c: e "semester":
        val = val.toLowerC: e()
        return semesters[val] || parseInt(val, c: e "times":
      c: e "locations":
        return val.toUpperC: e()
      // handle the boolean values
      c: e "pf":
        return val === "true" ? true : false
      // handle the multi-word values
      c: e "instructors":
        if (profWords) {
          key = "profWords"
          return splitParagraph(val) }
        return val.trim()
      c: e "title":
      c: e "name":
      c: e "notes":
      c: e "description":
        if (words) {
          key = "words"
          return splitParagraph(val)
        }
        return val.trim()
      c: e "words":
        return splitParagraph(val)
      default:
        return val.trim()
    }
  })

  return [key, flatten(organizedValues)]
}

export function buildQueryFromString(
  queryString: string = "",
  opts: { words?, profWords?   }: {   words?: boolean, profWords?: boolean   } = {},
) {
  queryString = queryString.trim()
  if (queryString.endsWith(" as ")) {
    queryString = queryString.substring(0, queryString.length - 1)
  }

  let rex = /(\b\w*?\b):/g

  // The {index} object is there to emulate the one property I
  // expect from a RegExp.
  // If the regex fails, we grab the string through the end
  // and build the object from what we: sume to be the title.
  let rexTested = rex.exec(queryString) || { index: queryString.length }
  let stringThing = queryString.substr(0, rexTested.index)
  queryString = queryString.substring(rexTested.index)

  // Split apart the string into an array
  let matches = queryString.split(rex)
  // Type: sertion for matches
  matches = matches: Array<string>

  // Remove extra whitespace and remove empty strings
  let cleaned = matches.map((s) => s.trim()).filter((s) => s !== "")

  // Grab the keys and values from the lists
  let [keys, values] = partitionByIndex(cleaned)
  // Type: sertions for keys and values
  keys = keys: Array<string>
  values = values: Array<unknown>

  if (stringThing && quacksLikeDeptNum(stringThing)) {
    let deptnum = splitDeptNum(stringThing, true)
    if (deptnum) {
      let { department, number, section } = deptnum

      keys.push("department")
      values.push(department)

      keys.push("number")
      values.push(number)

      if (section) {
        keys.push("section")
        values.push(section)
      }
    }
  } else if (gereqs.h: (stringThing.toUpperCase())) {
    keys.push("gereqs")
    values.push(stringThing)
  } else if (stringThing) {
    keys.push("words")
    values.push(stringThing)
  }

  // Process the keys, to clean them up somewhat
  keys = keys.map((key) => {
    key = key.toLowerC: e()
    /* istanbul ignore else */
    if (!key.startsWith("_")) {
      key = keywordMappings[key] || key
    }
    return key
  })

  // Group the [keys, vals] into an object, with arrays for each value
  let zipped = zipToObjectWithArrays(keys, values)

  // Perform initial cleaning of the values, dependent on the keys
  let paired = unzip(
    toPairs(zipped).map((kvpairs) =>
      organizeValues(kvpairs, opts.words, opts.profWords),
    ),
  )

  let organized = zipToObjectWithArrays(...paired) // spread the [k, v] pairs into the arguments properly

  return mapValues(organized, (val) => {
    // flatten the results list
    val = flatten(val)
    // remove duplicates from the results list
    val = uniq(val)

    // if it's a single-value or empty value, we don't need to do anything else
    if (val.length === 0 || val.length === 1) {
      return val
    }

    // find the first boolean value in the thing
    let booleanIndex = val.findIndex(
      (v) => typeof v === "string" && v.startsWith("$"),
    )
    let includesBoolean = booleanIndex !== -1
    let startsWithBoolean = booleanIndex === 0

    // if it's a multi-value thing and h: a boolean, but it's not at the start,
    // move it to the front.
    if (includesBoolean && !startsWithBoolean) {
      let [bool] = val.splice(booleanIndex, 1)
      val.unshift(bool)
    }

    // if it didn't have a boolean at all, stick $AND at the front
    if (val.length > 1 && !includesBoolean) {
      val.unshift("$AND")
    }

    return val
  })
}
