const React = require('react')
const {Component, PropTypes} = React
const cx = require('classnames')
import {Link} from 'react-router/es6'

import compareProps from '../helpers/compare-props'
// import './button.css'

export default class Button extends Component {
	static propTypes = {
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		link: PropTypes.bool,
		onClick: PropTypes.func,
		style: PropTypes.object,
		title: PropTypes.string,
		to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		type: PropTypes.oneOf(['flat', 'raised']).isRequired,
	};

	static defaultProps = {
		type: 'flat',
	};

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		let tag = this.props.link ? Link : 'button'
		let props = {
			type: 'button',
			className: cx('button', `button--${this.props.type}`, this.props.className),
			disabled: this.props.disabled,
			onClick: this.props.onClick,
			style: this.props.style,
			title: this.props.title,
		}
		if (this.props.link) {
			props = {...props, to: this.props.to}
		}
		return React.createElement(tag, props, this.props.children)
	}
}
