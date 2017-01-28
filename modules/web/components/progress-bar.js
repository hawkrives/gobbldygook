// @flow
import React from 'react'
import cx from 'classnames'
import { findWordForProgress } from 'modules/lib'

import './progress-bar.scss'

type ProgressBarProps =  {
	className?: string,
	colorful?: boolean,
	max?: number,
	value: number,
};

export default function ProgressBar(props: ProgressBarProps) {
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
		{ [progressWord]: colorful })

	return (
		<div className={classNames}>
			<div className="progress-bar--track" style={{ height: '100%', width: '100%' }}>
				<div className="progress-bar--value" style={{ height: '100%', width: `${width}%` }} />
			</div>
		</div>
	)
}
