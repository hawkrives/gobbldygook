import React, {Component, PropTypes} from 'react'
import filter from 'lodash/collection/filter'

import Requirement from './requirement'

// import './area.scss'

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
