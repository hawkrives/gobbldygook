import React, {PropTypes} from 'react'
import cx from 'classnames'
import {findWordForProgress} from 'modules/lib'

import './progress-bar.scss'

export default function ProgressBar(props) {
	const {
		value,
		max = 1,
		colorful,
		className,
	} = props

	const width = 100 * (value / max)
	const progressWord = findWordForProgress(max, value)
	const classNames = cx('progress-bar',
		className,
		{[progressWord]: colorful})

	return (
		<div className={classNames}>
			<div className='progress-bar--track' style={{height: '100%', width: '100%'}}>
				<div className='progress-bar--value' style={{height: '100%', width: `${width}%`}} />
			</div>
		</div>
	)
}

ProgressBar.propTypes = {
	className: PropTypes.string,
	colorful: PropTypes.bool,
	max: PropTypes.number,
	value: PropTypes.number,
}
