import React, {PropTypes} from 'react'
import cx from 'classnames'

export default function ResultIndicator({result}) {
	return (
		<span className={cx('result-indicator', result ? 'result-indicator--success' : 'result-indicator--failure')}>
			{result ? '✓' : '×'}
		</span>
	)
}

ResultIndicator.propTypes = {
	result: PropTypes.bool,
}
