import React, {Component, PropTypes, isValidElement, cloneElement} from 'react'
import cx from 'classnames'

import './list.scss'

export default class List extends Component {
	static propTypes = {
		canSelect: PropTypes.bool,
		children: PropTypes.any.isRequired,
		className: PropTypes.string,
		onChange: PropTypes.func,
		seperator: PropTypes.string,
		type: PropTypes.oneOf(['inline', 'number', 'bullet', 'plain']).isRequired,
	}

	static defaultProps = {
		type: 'inline',
	}

	render() {
		const contents = React.Children.map(this.props.children, child =>
			cloneElement(child, {...child.props, className: cx('list-item', child.props.className)}))

		const className = cx('list', `list--${this.props.type}`, this.props.className)

		if (this.props.type === 'number') {
			return <ol className={className}>{contents}</ol>
		}

		return <ul className={className}>{contents}</ul>
	}
}
