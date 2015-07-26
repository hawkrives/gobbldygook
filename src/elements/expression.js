import React, {Component, PropTypes} from 'react'

import CourseExpression from './expression--course'

import cx from 'classnames'
import plur from 'plur'
// import './expression.scss'

const joiners = {
    $and: 'AND',
    $or: 'OR',
}

function makeBooleanExpression({expr, ctx}) {
    let kind = '$invalid'

    if (expr.hasOwnProperty('$and')) {
        kind = '$and'
    }

    else if (expr.hasOwnProperty('$or')) {
        kind = '$or'
    }

    const contents = expr[kind].reduce((acc, exp, i) => {
        if (i > 0) {
            acc.push(<span key={`${i}-joiner`} className='joiner'>{joiners[kind]}</span>)
        }
        acc.push(<Expression key={i} expr={exp} ctx={ctx} />)
        return acc
    }, [])

    return {contents}
}

function makeOfExpression({expr, ctx}) {
    const description = `${expr._counted || 0} of ${expr.$count}`

    const contents = expr.$of.map((ex, i) =>
                <Expression key={i} expr={ex} ctx={ctx} />)

    return {description, contents}
}

function makeModifierExpression({expr}) {
    const description = `${expr._counted} of ${expr.$count} ${plur(expr.$what, expr.$count)} from ${expr.$from}`

    return {description}
}

function makeWhereExpression({expr}) {
    const description = JSON.stringify(expr)

    return {description}
}

export default class Expression extends Component {
    static propTypes = {
        ctx: PropTypes.object.isRequired,
        expr: PropTypes.shape({
            $type: PropTypes.string,
        }).isRequired,
    }

    render() {
        const {expr} = this.props
        const {$type} = expr

        if (!$type) {
            return null
        }

        const wasComputed = expr.hasOwnProperty('_result')
        const computationResult = expr._result

        let contents = null
        let description = null

        if ($type === 'boolean') {
            ({contents} = makeBooleanExpression({...this.props}))
        }

        else if ($type === 'course') {
            contents = <CourseExpression {...expr.$course} />
        }

        else if ($type === 'reference') {
            contents = expr.$requirement
        }

        else if ($type === 'of') {
            ({contents, description} = makeOfExpression({...this.props}))
        }

        else if ($type === 'modifier') {
            ({description} = makeModifierExpression({...this.props}))
        }

        else if ($type === 'where') {
            ({description} = makeWhereExpression({...this.props}))
        }

        else {
            console.warn(`Expression(): type not handled: ${$type}`)
            console.log(this.props)
            contents = JSON.stringify(expr)
        }

        const className = cx(
            'expression',
            `expression--${$type}`,
            wasComputed ? 'computed' : 'computed--not',
            computationResult ? 'computed-success' : 'computed-failure')

        return (
            <span className={className}>
                {description ? <p className='expression--description'>{description}</p> : null}
                {contents ? <span className='expression--contents'>{contents}</span> : null}
            </span>
        )
    }
}
