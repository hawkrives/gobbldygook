const React = require('react')
const {
	Children: ReactChildren,
	PropTypes,
	isValidElement,
	cloneElement,
} = React
const cx = require('classnames')

// import './list.css'

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
