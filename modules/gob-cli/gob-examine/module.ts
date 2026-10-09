import meow from "meow"
import {
  isRequirementName,
  humanizeOperator,
  evaluate,
} from "@gob/examine-student"
import type {
  BooleanExpression,
  Course,
  CourseExpression,
  Expression,
  Filter,
  ModifierExpression,
  OccurrenceExpression,
  OfExpression,
  Operator,
  OverridesObject,
  ParsedHansonFile,
  Qualifier,
  QualificationValue,
  ReferenceExpression,
  Requirement,
  WhereExpression,
} from "@gob/examine-student"
import yaml from "js-yaml"
import get from "lodash/get"
import repeat from "lodash/repeat"
import plur from "plur"
import chalk from "chalk"
import { loadStudent } from "../lib/load-student"

// The child requirements of an evaluated requirement
function childRequirements(
  requirement: Requirement,
): Array<[string, Requirement]> {
  return Object.entries(requirement)
    .filter(([k]) => isRequirementName(k))
    .map(([k, v]) => [k, v as Requirement])
}

function condenseCourse(course: Course) {
  const num =
    "number" in course ? course.number : `${String(course.level)[0]}XX`
  return `${String(course.department)} ${String(num)}`
}

function summarize(
  requirement: Requirement,
  name: string,
  path: Array<string>,
  depth = 0,
): string {
  let prose = ""
  const subReqs = childRequirements(requirement)
  if (subReqs.length) {
    prose =
      "\n" +
      subReqs
        .map(([k, v]) => summarize(v, k, path.concat(k), depth + 1))
        .join("\n")
  }

  return `${repeat(" ", depth * 2)}${name}: ${String(
    requirement.computed,
  )}${prose}`
}

function stringifyChunk(expr: Expression): string {
  let resultString = ""
  switch (expr.$type) {
    case "boolean":
      resultString = stringifyBoolean(expr)
      break
    case "course":
      resultString = stringifyCourse(expr)
      break
    case "modifier":
      resultString = stringifyModifier(expr)
      break
    case "occurrence":
      resultString = stringifyOccurrence(expr)
      break
    case "of":
      resultString = stringifyOf(expr)
      break
    case "reference":
      resultString = stringifyReference(expr)
      break
    case "where":
      resultString = stringifyWhere(expr)
      break
    case "filter":
    default:
      throw new Error(`uh oh! unknown type "${expr.$type}"`)
  }

  if ("_result" in expr) {
    const color = expr._result ? chalk.green : chalk.red
    return color(`${resultString}: ${String(expr._result)}`)
  }

  return resultString
}

const AND = chalk.bold("AND")
const OR = chalk.bold("OR")

function stringifyBoolean(expr: BooleanExpression) {
  if (expr.$booleanType === "or") {
    const str = expr.$or.map((req) => stringifyChunk(req)).join(` ${OR} `)
    return `(${str})`
  }
  const str = expr.$and.map((req) => stringifyChunk(req)).join(` ${AND} `)
  return `(${str})`
}

function stringifyCourse(expr: CourseExpression) {
  return condenseCourse(expr.$course)
}

function stringifyChildren(expr: {
  $children: "$all" | Array<ReferenceExpression>
}) {
  if (expr.$children === "$all") {
    return "all children"
  }
  const str = expr.$children.map(stringifyReference).join(", ")
  return `(${str})`
}

function stringifyModifier(expr: ModifierExpression) {
  let modifier
  if (expr.$from === "children") {
    modifier = stringifyChildren(expr)
  } else if (expr.$from === "filter") {
    modifier = "filter"
  } else if (expr.$from === "filter-where") {
    modifier = `filter, where {${stringifyWhereClause(expr.$where)}}`
  } else if (expr.$from === "where") {
    modifier = `where {${stringifyWhereClause(expr.$where)}}`
  } else {
    modifier = `${stringifyChildren(expr)}, where {${stringifyWhereClause(
      expr.$where,
    )}}`
  }

  const word = plur(expr.$what, expr.$count.$num)
  const besides = expr.$besides
    ? `[besides ${condenseCourse(expr.$besides.$course)}] `
    : ""
  return `${expr.$count.$num} ${word} ${besides}from ${modifier}`
}

function stringifyOccurrence(expr: OccurrenceExpression) {
  const word = expr.$count.$num === 1 ? "occurrence" : "occurrences"
  return `${expr.$count.$num} ${word} of ${condenseCourse(expr.$course)}`
}

function stringifyOf(expr: OfExpression) {
  const op = humanizeOperator(expr.$count.$operator)
  const qualifier = op ? ` ${op}` : ""
  const ofs = expr.$of.map((req) => stringifyChunk(req)).join(", ")
  return `${expr.$count.$num} of${qualifier} (${ofs})`
}

function stringifyReference(expr: ReferenceExpression) {
  return `*${expr.$requirement}`
}

function stringifyQualification({
  $key,
  $operator,
  $value,
}: {
  $key: string
  $operator: Operator
  $value: QualificationValue
}): string {
  if (typeof $value === "object") {
    if ($value.$type === "function") {
      const computed = $value["$computed-value"]
      if (computed === undefined) {
        throw new TypeError(
          `stringifyQualification(): the "${$value.$name}" function was never computed`,
        )
      }
      return stringifyQualification({ $key, $operator, $value: computed })
    }

    let ds: Array<QualificationValue>
    let conjunction: string
    if ($value.$booleanType === "or") {
      ds = $value.$or
      conjunction = ` ${OR} `
    } else {
      ds = $value.$and
      conjunction = ` ${AND} `
    }
    return ds
      .map((val) => stringifyQualification({ $key, $operator, $value: val }))
      .join(conjunction)
  }

  // it's a static value; a number or string
  switch ($operator) {
    case "$eq":
      return `${$key} = ${$value}`
    case "$ne":
      return `${$key} != ${$value}`
    case "$lt":
      return `${$key} < ${$value}`
    case "$lte":
      return `${$key} <= ${$value}`
    case "$gt":
      return `${$key} > ${$value}`
    case "$gte":
      return `${$key} >= ${$value}`
    default:
      throw new TypeError(
        `stringifyQualification: "${String($operator)}" is not a valid operator`,
      )
  }
}

function stringifyWhereClause(clause: Qualifier): string {
  if (clause.$type === "qualification") {
    return stringifyQualification(clause)
  }
  if (clause.$booleanType === "and") {
    return clause.$and.map(stringifyWhereClause).join(" AND ")
  }
  return clause.$or.map(stringifyWhereClause).join(" | ")
}

function stringifyWhere(expr: WhereExpression) {
  const word = plur("course", expr.$count.$num)
  const where = stringifyWhereClause(expr.$where)
  return `${expr.$count.$num} ${word} where {${where}}`
}

function stringifyFilter(filter: Filter) {
  let resultString = "Filter: "

  // a filter will be either a where-style query or a list of courses
  if (filter.$filterType === "where") {
    const where = stringifyWhereClause(filter.$where)
    resultString += `only courses where {${where}}`
  } else {
    const ofs = filter.$of.map((req) => stringifyChunk(req)).join(", ")
    resultString += `only (${ofs})`
  }

  return resultString
}

function indent(indentWith: string, string: string) {
  return string
    .split("\n")
    .map((line) => indentWith + line)
    .join("\n")
}

function proseify(
  requirement: Requirement,
  name: string,
  path: Array<string>,
  depth = 0,
): string {
  let prose = childRequirements(requirement)
    .map(([k, v]) => proseify(v, k, path.concat(k), depth + 1))
    .join("\n")

  let resultString = `${name}: `

  if (requirement.filter) {
    resultString += stringifyFilter(requirement.filter) + "\n"
  }

  // Now check for results
  if (requirement.result) {
    resultString += stringifyChunk(requirement.result) + "\n"
  } else if (requirement.message !== undefined) {
    // or ask for an override
    resultString += requirement.message + "\n"
  }

  return indent(depth ? "  " : "", `${resultString}${prose}`)
}

type Flags = {
  json: boolean
  yaml: boolean
  prose: boolean
  summary: boolean
  status: boolean
  path: string | undefined
}

// Returns whether the area (or the requirement at --path) passed
function checkAgainstArea(
  {
    courses,
    overrides,
  }: { courses: Array<Course>; overrides: OverridesObject },
  args: Flags,
  areaData: ParsedHansonFile,
): boolean {
  let path = [String(areaData.type), String(areaData.name)]
  let result: Requirement = evaluate({ area: areaData, courses, overrides })

  if (args.path) {
    let subPath = args.path.split(".")
    let subResult: unknown = get(result, subPath)
    if (typeof subResult !== "object" || subResult === null) {
      throw new Error(`could not find "${args.path}" in ${path.join(" > ")}`)
    }
    result = subResult as Requirement
    path = path.concat(subPath)
  }

  if (args.json) {
    console.log(JSON.stringify(result, null, 2))
  } else if (args.yaml) {
    console.log(yaml.safeDump(result))
  } else if (args.prose) {
    console.log(proseify(result, String(areaData.name), path))
  } else if (args.summary) {
    console.log(summarize(result, String(areaData.name), path))
  }

  let outcome = result.computed ? "success" : "failure"
  if (!args.status) {
    console.log(
      `[${String(areaData.type)}] ${String(areaData.name)}: ${outcome}`,
    )
  }

  return Boolean(result.computed)
}

export default async function main() {
  const args = meow(
    `
		usage: gob-examine <FILE>

		FILE: the file to process

		--json: print raw json output
		--yaml: print yaml-formatted json output
		--prose: print prose output
		--summary: print summarized output
		--status: no output; only use exit code
		--path: change the root of the evaluation
	`,
    {
      flags: {
        json: { type: "boolean", default: false },
        yaml: { type: "boolean", default: false },
        prose: { type: "boolean", default: false },
        summary: { type: "boolean", default: false },
        status: { type: "boolean", default: false },
        path: { type: "string" },
      },
    },
  )

  let { input, flags } = args

  let { areas, courses, overrides } = await loadStudent(input[0])

  let allPassed = true
  for (const area of areas) {
    let passed = checkAgainstArea({ courses, overrides }, flags, area)
    allPassed = allPassed && passed
  }

  if (!allPassed) {
    process.exitCode = 1
  }
}
