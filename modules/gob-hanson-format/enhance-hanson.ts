import isRequirementName from "./is-requirement-name"
import fromPairs from "lodash/fromPairs"
import toPairs from "lodash/toPairs"
import { makeAreaSlug } from "./make-area-slug"
import { parse } from "./parse-hanson-string"
import type {
  Mapped,
  HansonFile,
  ParsedExpression,
  ParsedHansonFile,
  HansonRequirement,
  ParsedHansonRequirement,
} from "./types"

type PegStartRule = "Filter" | "Result"

const requirementNameRegex = /(.*?) +\(([A-Z-]+)\)$/i
const quote = (str: string) => `"${str}"`
const quoteAndJoin = (list: Iterable<string>) => [...list].map(quote).join(", ")

const topLevelWhitelist = new Set([
  "result",
  "message",
  "declare",
  "children share courses",
  "name",
  "revision",
  "type",
  "sourcePath",
  "slug",
  "source",
  "dateAdded",
  "available through",
  "_error",
])
const lowerLevelWhitelist = new Set([
  "result",
  "message",
  "declare",
  "children share courses",
  "filter",
  "message",
  "description",
  "student selected",
  "contract",
])
export function enhanceHanson(data: HansonFile): ParsedHansonFile {
  if (typeof data !== "object") {
    throw new Error("data was not an object!")
  }

  // Ensure that a result, message, or filter key exists.
  // If filter's the only one, it's going to filter the list of courses
  // available to the child requirements when this is evaluated.
  if (!("result" in data)) {
    throw new TypeError('"result" is a required key')
  }

  Object.keys(data).forEach((key) => {
    if (!isRequirementName(key) && !topLevelWhitelist.has(key)) {
      const whitelistStr = quoteAndJoin(topLevelWhitelist)
      throw new TypeError(
        `only [${whitelistStr}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`,
      )
    }
  })

  // because this only runs at the top level, we know
  // that we'll have a name to use
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing, typescript/strict-boolean-expressions -- an empty (or non-string falsy) slug or name from the YAML falls back like a missing one
  let slug = data.slug || makeAreaSlug(data.name || "")

  // YAML turns an unquoted revision like 2020-21 into a number or a date
  const rev: unknown = data.revision
  const revName = String(rev)
  // a falsy revision (missing, null, 0, ...) is allowed through
  const hasRevision = Boolean(rev)
  if (hasRevision && typeof rev !== "string") {
    let msg = `"revision" must be a string. Try wrapping it in single quotes. "${revName}" is a ${typeof rev}.`
    throw new TypeError(msg)
  }

  let { abbreviations, titles } = extractRequirementNames(data)
  let result = parseWithPeg(data.result, {
    abbreviations,
    titles,
    startRule: "Result",
  })

  let enhanced = toPairs(data).map(([key, value]): [string, unknown] => {
    if (isRequirementName(key)) {
      return [key, enhanceRequirement(value)]
    }
    return [key, value]
  })

  let requirements: Mapped<unknown> = fromPairs(enhanced)
  let { name, type, revision, dateAdded, "available through": available } = data

  let returnValue: ParsedHansonFile = {
    ...requirements,
    $type: "requirement",
    name,
    type,
    revision,
    slug,
    result,
  }

  // YAML may give any type here, and any falsy value is left off; the
  // undefined checks only narrow the types
  const hasDateAdded = Boolean(dateAdded)
  if (dateAdded !== undefined && hasDateAdded) {
    returnValue.dateAdded = dateAdded
  }

  const hasAvailable = Boolean(available)
  if (available !== undefined && hasAvailable) {
    returnValue["available through"] = available
  }

  return returnValue
}

function enhanceRequirement(value: unknown): ParsedHansonRequirement {
  // 1. adds 'result' key, if missing
  // 2. parses the 'result' and 'filter' keys
  // 3. throws if it encounters any lowercase keys not in the whitelist
  // 4. throws if it cannot find any of the required keys

  // expand simple strings into {result: string} objects
  if (typeof value === "string") {
    value = { result: value, filter: null, declare: {} }
  }

  if (typeof value !== "object" || value === null) {
    throw new Error("data was not an object!")
  }

  // The checks below reject any key a requirement can't have.
  const requirement = value as HansonRequirement
  let keys = Object.keys(requirement)

  // Ensure that a result, message, or filter key exists.
  // If filter's the only one, it's going to filter the list of courses
  // available to the child requirements when this is evaluated.
  const oneOfTheseKeysMustExist = new Set(["result", "message", "filter"])
  if (!keys.some((key) => oneOfTheseKeysMustExist.has(key))) {
    let requiredKeys = quoteAndJoin(oneOfTheseKeysMustExist)
    let existingKeys = quoteAndJoin(keys)
    throw new TypeError(
      `could not find any of [${requiredKeys}] in [${existingKeys}].`,
    )
  }

  keys.forEach((key) => {
    if (!isRequirementName(key) && !lowerLevelWhitelist.has(key)) {
      const whitelistStr = quoteAndJoin(lowerLevelWhitelist)
      throw new TypeError(
        `only [${whitelistStr}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`,
      )
    }
  })

  // Create the lists of requirement titles and abbreviations for the parser.
  let { abbreviations, titles } = extractRequirementNames(requirement)

  // We load the list of variables with the keys listed in the `declare` key
  // into the declaredVariables map. They're defined as a [string: string]
  // mapping.
  let { declare: variables = {}, result, filter, ...requirements } = requirement

  // YAML may give any type here; parseWithPeg rejects a truthy non-string,
  // and any falsy value means there is no filter (or result)
  const hasFilter = Boolean(filter)
  const hasResult = Boolean(result)

  let parsedFilter = hasFilter
    ? parseWithPeg(filter, {
        abbreviations,
        titles,
        variables,
        startRule: "Filter",
      })
    : null

  let parsedResult = hasResult
    ? parseWithPeg(result, {
        abbreviations,
        titles,
        variables,
        startRule: "Result",
      })
    : null

  let enhanced = toPairs(requirements).map(
    ([key, value]): [string, unknown] => {
      if (lowerLevelWhitelist.has(key)) {
        return [key, value]
      }

      return [key, enhanceRequirement(value)]
    },
  )

  let returnedValue: ParsedHansonRequirement = {
    ...fromPairs(enhanced),
    $type: "requirement",
  }

  if (parsedResult) {
    returnedValue.result = parsedResult
  }

  if (parsedFilter) {
    returnedValue.filter = parsedFilter
  }

  return returnedValue
}

function assertString(value: unknown): string {
  return `\`${String(value)}\` should be \`string\`, not \`${typeof value}\``
}

function extractRequirementNames(data: object) {
  // Create the lists of requirement titles and abbreviations for the parser.
  // Because we allow both full titles ("Biblical Studies") and shorthand
  // abbreviations ("BTS-B") all glommed together into one string ("Biblical
  // Studies (BTS-B)"), we need a method of splitting those apart so the
  // PEG's ReferenceExpression can correctly reference them.
  const requirements = Object.keys(data).filter(isRequirementName)
  const abbreviations: Mapped<string> = fromPairs(
    requirements.map((req) => [req.replace(requirementNameRegex, "$2"), req]),
  )
  const titles: Mapped<string> = fromPairs(
    requirements.map((req) => [req.replace(requirementNameRegex, "$1"), req]),
  )
  return { abbreviations, titles }
}

type ParsePegArgs = Readonly<{
  variables?: Mapped<string>
  titles: Mapped<string>
  abbreviations: Mapped<string>
  startRule: PegStartRule
}>

function parseWithPeg(value: unknown, args: ParsePegArgs): ParsedExpression {
  let { variables = {}, titles, abbreviations, startRule } = args

  if (typeof value !== "string") {
    throw new Error(assertString(value))
  }

  let source = insertVariables(value, variables)

  try {
    return parse(source, { abbreviations, titles, startRule })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new SyntaxError(`${message} (in '${source}')`)
  }
}

function insertVariables(value: string, vars: Mapped<unknown>): string {
  // Next up, we go through the list of variables and look for any
  // occurrences of the named variables in the value, prefixed with
  // a $. So, for instance, the variable defined as "math-level-3"
  // would be referenced via "$math-level-3".

  for (let [name, contents] of toPairs(vars)) {
    if (typeof contents !== "string") {
      throw new Error(assertString(contents))
    }

    let exprName = `$${name}`
    // istanbul ignore else
    if (value.includes(exprName)) {
      value = value.split(exprName).join(contents)
    }
  }

  return value
}
