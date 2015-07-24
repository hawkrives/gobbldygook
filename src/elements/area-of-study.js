import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'

import Requirement from './requirement'

// import './area.scss'

function findRequirementsWithNoChildren(requirement) {
    // const mutated = mapValues(data, (value, key) => {
    //     if (isRequirementName(key)) {
    //         // expand simple strings into {result: string} objects
    //         if (isString(value)) {
    //             value = {result: value}
    //         }

    //         // then run enhance on the resultant object
    //         value = enhanceHanson(value, {topLevel: false})

    //         // also set $type; the PEG can't do it b/c the spec file is YAML
    //         // w/ PEG result strings.
    //         value.$type = 'requirement'
    //     }

    //     else if (key === 'result' || key === 'filter') {
    //         forEach(declaredVariables, (contents, name) => {
    //             if (includes(value, '$' + name)) {
    //                 value = value.split(`$${name}`).join(contents)
    //             }
    //         })

    //         try {
    //             value = parse(value, {abbreviations, titles})
    //         }
    //         catch (e) {
    //             throw new SyntaxError(`enhanceHanson(): ${e.message} (in '${value}')`)
    //         }
    //     }

    //     return value
    // })
    return []
}

export default class AreaOfStudy extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        result: PropTypes.object.isRequired,
        revision: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }

    static defaultProps = {
        name: 'Unknown Area',
        type: '???',
        revision: '0000-00',
        result: {},
    }

    render() {
        const finalReqs = findRequirementsWithNoChildren(this.props)
        const maxProgress = finalReqs.length
        const currentProgress = filter(finalReqs)

        return (
            <details className='area'>
                <summary className='summary'>
                    <h1 className='area--title'>{this.props.name}</h1>
                </summary>
                <Requirement {...this.props} topLevel />
            </details>
        )
    }
}
