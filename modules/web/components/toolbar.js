// @flow
import React from 'react'
import cx from 'classnames'
import './toolbar.scss'

export default function Toolbar(props: {children?: any, className?: string, style: Object}) {
	return (
		<div className={cx('toolbar', props.className)} style={props.style}>
			{props.children}
		</div>
	)
}
