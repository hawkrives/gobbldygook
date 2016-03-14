import React, {PropTypes} from 'react'
// import CourseExpression from './expression--course'
import Expression, {makeWhereExpression} from './expression'
import map from 'lodash/map'

function FilterOf({expr, ctx}) {
	return <div>
		{map(expr.$of, (ex, i) => {
			console.log(ex)
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

function FilterWhere({expr}) {
	let {description, contents} = makeWhereExpression({expr})
	return <div><p>{description}</p><div>{contents}</div></div>
}
FilterWhere.propTypes = {
	ctx: PropTypes.object,
	expr: PropTypes.shape({
		$where: PropTypes.array,
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
