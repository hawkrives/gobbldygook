const React = require('react')
const {PropTypes} = React
const cx = require('classnames')
// import './toolbar.css'

export default function Toolbar(props) {
	return (
		<div className={cx('toolbar', props.className)} style={props.style}>
			{props.children}
		</div>
	)
}

Toolbar.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	style: PropTypes.object,
}
