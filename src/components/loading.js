import React, {PropTypes} from 'react'
import cx from 'classnames'

import './loading.css'

export default function Loading({className, children}) {
	return (
		<figure className='loading…'>
			<div className='loading-spinner'><div /></div>
			<figcaption className={cx('loading-message', className)}>
				{children}
			</figcaption>
		</figure>
	)
}

Loading.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
}
