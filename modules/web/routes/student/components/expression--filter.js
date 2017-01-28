import React, { PropTypes } from 'react'
// import CourseExpression from './expression--course'
import Expression, { makeWhereQualifier } from './expression'
import map from 'lodash/map'
import debug from 'debug'
const log = debug('web:react')

function FilterOf({ expr, ctx }) {
  return <div>
		{map(expr.$of, (ex, i) => {
  log(ex)
  return <Expression key={i} expr={ex} ctx={ctx} />
})}
	</div>
}
FilterOf.propTypes = {
  ctx: PropTypes.object,
  expr: PropTypes.shape({
    $of: PropTypes.array,
  }),
}

function FilterWhere({ expr }) {
  const qualifier = makeWhereQualifier(expr.$where)
  const description = `only courses where ${qualifier}`

  return <div><p>{description}</p></div>
}
FilterWhere.propTypes = {
  ctx: PropTypes.object,
  expr: PropTypes.shape({
    $where: PropTypes.object,
  }),
}

export default function Filter(props) {
  if (props.expr.$of) {
    return <FilterOf {...props} />
  }
  else if (props.expr.$where) {
    return <FilterWhere {...props} />
  }
  return <div>{JSON.stringify(props, null, 2)}</div>
}

Filter.propTypes = {
  ctx: PropTypes.object,
  expr: PropTypes.object,
}
