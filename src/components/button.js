import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onClick: PropTypes.func,
		title: PropTypes.string,
		type: PropTypes.oneOf(['flat', 'raised']).isRequired,
	}

	static defaultProps = {
		type: 'flat',
	}

	render() {
		return (
			<button
				className={cx('button', `button--${this.props.type}`, this.props.className)}
				disabled={this.props.disabled}
				onClick={this.props.onClick}
				title={this.props.title}>
				{this.props.children}
			</button>
		)
	}
}
