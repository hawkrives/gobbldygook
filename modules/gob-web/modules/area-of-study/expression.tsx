import type * as React from "react"
import cx from "classnames"
import CourseExpression from "./expression--course"
import ResultIndicator from "./result-indicator"
import type {
  BooleanExpression,
  Course,
  Expression as ExpressionType,
  ModifierExpression,
  OccurrenceExpression,
  OfExpression,
  Operator,
  Qualifier,
  QualificationValue,
  WhereExpression,
} from "@gob/examine-student"
import plur from "plur"
import { humanizeOperator } from "@gob/examine-student"

import "./expression.scss"

const JOINERS = {
  $and: "AND",
  $or: "OR",
}

function makeBooleanExpression(expr: BooleanExpression, ctx: unknown) {
  const [kind, children] =
    "$and" in expr
      ? (["$and", expr.$and] as const)
      : (["$or", expr.$or] as const)

  const contents = children.reduce<Array<React.ReactElement>>((acc, exp, i) => {
    if (i > 0) {
      acc.push(
        <span key={`${i}-joiner`} className="joiner">
          {JOINERS[kind]}
        </span>,
      )
    }

    acc.push(<Expression key={i} expr={exp} ctx={ctx} />)

    return acc
  }, [])

  return { contents }
}

// $was comes from an area file, so it may not be one of these
const ofLookup: Readonly<Record<string, string | undefined>> = {
  all: "All of",
  any: "Any of",
  none: "None of",
}

function makeOfExpression(expr: OfExpression, ctx: unknown) {
  const description = expr.$count.$was
    ? (ofLookup[expr.$count.$was] ?? "???")
    : `${expr._counted ?? 0} of ${humanizeOperator(
        expr.$count.$operator,
      )} ${expr.$count.$num} from among`

  let contents = expr.$of.map((ex, i) => (
    <Expression key={i} expr={ex} ctx={ctx} />
  ))

  let allAreReferences = expr.$of.every((expr) => expr.$type === "reference")
  if (allAreReferences) {
    contents = []
  }

  return { description, contents }
}

function makeModifierExpression(expr: ModifierExpression) {
  const op = humanizeOperator(expr.$count.$operator)
  const num = expr.$count.$num
  const needs = `${op} ${num} ${plur(expr.$what, expr.$count.$num)}`
  let from: string = expr.$from
  if (expr.$from === "where") {
    from = "courses where " + makeWhereQualifier(expr.$where)
  }
  const description = `${expr._counted ?? 0} of ${needs} from ${from}`
  return { description }
}

let operators: Readonly<Record<Operator, string>> = {
  $lte: "<=",
  $gte: ">=",
  $eq: "is",
  $ne: "!=",
  $gt: ">",
  $lt: "<",
}
let keys: Readonly<Record<string, string>> = {
  gereqs: "G.E.",
}

function stringifyWhereValue(value: QualificationValue): string {
  if (typeof value === "number") {
    return String(value)
  }

  if (typeof value === "string") {
    return value
  }

  if (value.$type === "function") {
    return String(value["$computed-value"])
  }

  // area files are parsed at runtime, so a value can match none of the types
  const unchecked: { $type?: unknown; $booleanType?: unknown } = value
  if (unchecked.$type === "boolean") {
    if (value.$booleanType === "or") {
      return value.$or.join(" OR ")
    } else if (unchecked.$booleanType === "and") {
      return value.$and.join(" AND ")
    }
  }

  return "Unknown"
}

export function makeWhereQualifier(where: Qualifier): string {
  // area files are parsed at runtime, so a qualifier can match none of the
  // types
  const unchecked: { $type?: unknown; $booleanType?: unknown } = where
  if (where.$type !== "qualification") {
    if (unchecked.$type === "boolean") {
      if (where.$booleanType === "and") {
        return where.$and.map(makeWhereQualifier).join(" AND ")
      } else if (unchecked.$booleanType === "or") {
        return where.$or.map(makeWhereQualifier).join(" OR ")
      }
    }

    return "unknown"
  }

  let operator = operators[where.$operator] || "?"
  let key = keys[where.$key] ?? where.$key
  let value = stringifyWhereValue(where.$value)
  return `${key} ${operator} ${value}`
}

function makeWhereExpression(expr: WhereExpression) {
  const op = humanizeOperator(expr.$count.$operator)
  const num = expr.$count.$num
  const needs = `${op} ${num}`
  const qualifier = makeWhereQualifier(expr.$where)
  const distinct = expr.$distinct ? "distinct " : ""
  const word = expr.$count.$num === 1 ? "course" : "courses"
  const counted = expr._counted ?? 0
  const description = `${counted} of ${needs} ${distinct}${word} from courses where ${qualifier}`

  let matches = expr._matches ?? []
  let contents: Array<React.ReactElement> | null = matches.map(
    (course: Course, i) => (
      <Expression
        key={i}
        expr={{ $type: "course", $course: course }}
        hideIndicator={true}
      />
    ),
  )

  if (!contents.length) {
    contents = null
  }

  return { description, contents }
}

function makeOccurrenceExpression(expr: OccurrenceExpression) {
  const op = humanizeOperator(expr.$count.$operator)
  const word = expr.$count.$num === 1 ? "occurrence" : "occurrences"
  const num = expr.$count.$num
  const description = `${expr._counted ?? 0} of ${op} ${num} ${word} of `

  const contents = (
    <Expression expr={{ $type: "course", $course: expr.$course }} />
  )

  return { description, contents }
}

export type Props = {
  // fulfillments are course expressions marked with _isFulfillment
  expr: ExpressionType & { _isFulfillment?: boolean; _taken?: boolean }
  hideIndicator?: boolean
  ctx?: unknown
}

export default function Expression(props: Props) {
  const { expr } = props
  const { $type } = expr

  // area files are parsed at runtime, so $type can be missing
  const unchecked: { $type?: unknown } = expr
  if (!unchecked.$type) {
    return null
  }

  const computationResult = expr._result
  const isFulfillment = expr._isFulfillment
  const wasUsed = Boolean(expr._result)
  const wasTaken = expr._taken
  const wasEvaluated = expr._checked

  let contents: React.ReactNode = null
  let description: string | null = null
  let result: React.ReactElement | null = null

  if (expr.$type === "boolean") {
    ;({ contents } = makeBooleanExpression(expr, props.ctx))
  } else if (expr.$type === "course") {
    // _request is the original course that was written in the spec.
    // $course is the matched course. It's used mostly by where-expressions and the like.
    contents = (
      <CourseExpression
        {...(expr._request ?? expr.$course)}
        _taken={expr._taken}
      />
    )
    result = <ResultIndicator result={wasTaken} />
  } else if (expr.$type === "reference") {
    contents = expr.$requirement
    result = <ResultIndicator result={computationResult} />
  } else if (expr.$type === "of") {
    ;({ contents, description } = makeOfExpression(expr, props.ctx))
  } else if (expr.$type === "modifier") {
    ;({ description } = makeModifierExpression(expr))
    result = <ResultIndicator result={computationResult} />
  } else if (expr.$type === "where") {
    ;({ description, contents } = makeWhereExpression(expr))
  } else if (expr.$type === "occurrence") {
    ;({ description, contents } = makeOccurrenceExpression(expr))
  } else {
    console.warn(`<Expression />: type not handled: ${$type}`, props)
    contents = JSON.stringify(expr, null, 2)
  }

  const className = cx([
    "expression",
    `expression--${$type}`,
    wasEvaluated ? "evaluated" : "not-evaluated",
    isFulfillment ? "fulfillment" : "",
    wasTaken ? "taken" : "not-taken",
    wasUsed ? "used" : "not-used",
  ])

  return (
    <span className={className}>
      {description && (
        <span className="expression--description">
          {description}
          {!props.hideIndicator && result}
        </span>
      )}
      {contents && (
        <span className="expression--contents">
          {typeof contents === "string" ? (
            <span className="expression--label">{contents}</span>
          ) : (
            contents
          )}
          {props.hideIndicator || expr._isFulfillment ? null : result}
        </span>
      )}
    </span>
  )
}
