import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
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
				onClick={this.props.onClick}
				title={this.props.title}>
				{this.props.children}
			</button>
		)
	}
}
