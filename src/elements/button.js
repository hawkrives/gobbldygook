import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		onClick: PropTypes.func,
	}

	render() {
		return (
			<button
				className={cx('button', this.props.className)}
				onClick={this.props.onClick}>
				{this.props.children}
			</button>
		)
	}
}
