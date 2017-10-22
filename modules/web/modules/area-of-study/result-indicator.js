import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../../components/icon'
import { checkmark, close } from '../../icons/ionicons'

export default function ResultIndicator({ result }) {
    return (
        <Icon
            className={`result-indicator ${result
                ? 'result-indicator--success'
                : 'result-indicator--failure'}`}
        >
            {result ? checkmark : close}
        </Icon>
    )
}

ResultIndicator.propTypes = {
    result: PropTypes.bool,
}
