import Expression, { makeWhereQualifier } from "./expression"

import type {
  FilterExpression,
  FilterOfExpression,
  FilterWhereExpression,
} from "@gob/examine-student"

type Props = {
  expr: FilterExpression
  ctx?: unknown
}

function FilterOf({ expr, ctx }: { expr: FilterOfExpression; ctx?: unknown }) {
  return (
    <div className="filter filter--of">
      <h4>Filter:</h4>
      {expr.$of.map((ex, i) => (
        <Expression key={i} expr={ex} ctx={ctx} />
      ))}
    </div>
  )
}

function FilterWhere({ expr }: { expr: FilterWhereExpression }) {
  const qualifier = makeWhereQualifier(expr.$where)
  const description = `only courses where ${qualifier}`

  return (
    <div className="filter filter--where">
      <h4>Filter:</h4>
      <p>{description}</p>
    </div>
  )
}

export default function Filter(props: Props) {
  // area files are parsed at runtime, so a filter can match none of the types
  const unchecked: { $type?: unknown; $filterType?: unknown } = props.expr
  const hasType = Boolean(unchecked.$type)
  if (!hasType) {
    return null
  }

  if (props.expr.$filterType === "of") {
    return <FilterOf expr={props.expr} ctx={props.ctx} />
  } else if (unchecked.$filterType === "where") {
    return <FilterWhere expr={props.expr} />
  } else {
    return <div>{JSON.stringify(props, null, 2)}</div>
  }
}
