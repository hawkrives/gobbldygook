import React, {
	Children as ReactChildren,
	PropTypes,
	isValidElement,
	cloneElement,
} from 'react'
import cx from 'classnames'

import './list.scss'

export default function List(props) {
	const {
		children,
		type='inline',
	} = props

	let {
		className,
	} = props

	// eslint-disable-next-line no-confusing-arrow
	const contents = ReactChildren.map(children, child =>
		isValidElement(child)
		? cloneElement(child, {...child.props, className: cx('list-item', child.props.className)})
		: child)

	className = cx('list', `list--${props.type}`, className)

	if (type === 'number') {
		return <ol className={className}>{contents}</ol>
	}

	return <ul className={className}>{contents}</ul>
}

List.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	type: PropTypes.oneOf(['inline', 'number', 'bullet', 'plain']).isRequired,
}
