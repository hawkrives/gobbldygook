// @flow
import React from 'react'
import cx from 'classnames'

import './loading.scss'

type LoadingProps = {
	children?: any,
	className?: string,
};

export default function Loading({ className, children }: LoadingProps) {
    return (
		<figure className="loading…">
			<div className="loading-spinner"><div /></div>
			<figcaption className={cx('loading-message', className)}>
				{children}
			</figcaption>
		</figure>
    )
}
