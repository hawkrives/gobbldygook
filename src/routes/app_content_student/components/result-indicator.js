import React, {PropTypes} from 'react'
import Icon from '../../../components/icon'

export default function ResultIndicator({result}) {
	return <Icon
		name={result ? 'checkmark' : 'close'}
		className={`result-indicator ${result ? 'result-indicator--success' : 'result-indicator--failure'}`}
	/>
}

ResultIndicator.propTypes = {
	result: PropTypes.bool,
}
