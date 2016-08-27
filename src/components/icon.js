import React, {PropTypes} from 'react'
import cx from 'classnames'

import './icon.scss'

export default function Icon(props) {
	return (
		<svg
			className={cx('icon', `icon--${props.type}`, props.className)}
			style={props.style}
		>
			<use xlinkHref={`./ionicons.svg#${props.name}`} />
		</svg>
	)
}

Icon.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string.isRequired,
	style: PropTypes.object,
	type: PropTypes.oneOf(['block', 'inline']).isRequired,
}

Icon.defaultProps = {
	type: 'inline',
}
