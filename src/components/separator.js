const React = require('react')
const {PropTypes} = React
const cx = require('classnames')

export default function Separator(props) {
	const {
		className,
		flex = 1,
		style,
		type = 'spacer',
	} = props

	let renderedStyle = {
		...style,
		display: 'flex',
		height: '100%',
		alignSelf: 'stretch',
		margin: 0,
		borderWidth: 0,
	}

	if (type === 'line') {
		renderedStyle = {...renderedStyle, borderWidth: '1px'}
	}
	else if (type === 'spacer') {
		renderedStyle = {...renderedStyle, padding: '0 0.5em'}
	}
	else if (type === 'flex-spacer') {
		renderedStyle = {...renderedStyle, flex}
	}

	return (
		<hr
			className={cx('separator', className)}
			style={renderedStyle}
		/>
	)
}

Separator.propTypes = {
	className: PropTypes.string,
	flex: PropTypes.number,
	style: PropTypes.object,
	type: PropTypes.oneOf(['spacer', 'line', 'flex-spacer']),
}
