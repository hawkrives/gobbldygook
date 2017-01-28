import React, {PropTypes} from 'react'
import cx from 'classnames'

import './icon.scss'

export default function Icon(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='512' height='512' viewBox='0 0 512 512'
			className={cx('icon', `icon--${props.type}`, props.className)}
			style={props.style}
		>
			{props.children}
		</svg>
	)
}

Icon.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	style: PropTypes.object,
	type: PropTypes.oneOf(['block', 'inline']).isRequired,
}

Icon.defaultProps = {
	type: 'inline',
}
