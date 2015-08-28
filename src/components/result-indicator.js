import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class ResultIndicator extends Component {
	static propTypes = {
		result: PropTypes.bool.isRequired,
	}

	render() {
		const symbol = this.props.result
			? '✓'
			: '×'

		return (
			<span className={cx('result-indicator', this.props.result ? 'result-indicator--success' : 'result-indicator--failure')}>
				{symbol}
			</span>
		)
	}
}
