// @flow
import React from 'react'
import cx from 'classnames'

import './icon.scss'


type IconProps = {
	children?: any,
	className?: string,
	style?: Object,
	type?: 'block' | 'inline',
};

export default function Icon({ className, style, children, type='inline' }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="512" height="512" viewBox="0 0 512 512"
			className={cx('icon', `icon--${type}`, className)}
			style={style}
		>
			{children}
		</svg>
	)
}
