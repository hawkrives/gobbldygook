import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import compareProps from '../helpers/compare-props'
import './button.scss'

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onClick: PropTypes.func,
		style: PropTypes.object,
		title: PropTypes.string,
		type: PropTypes.oneOf(['flat', 'raised']).isRequired,
	}

	static defaultProps = {
		type: 'flat',
	}

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		return (
			<button type='button'
				className={cx('button', `button--${this.props.type}`, this.props.className)}
				disabled={this.props.disabled}
				onClick={this.props.onClick}
				style={this.props.style}
				title={this.props.title}
			>
				{this.props.children}
			</button>
		)
	}
}
