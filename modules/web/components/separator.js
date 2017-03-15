// @flow
import React from 'react'
import cx from 'classnames'

type SeparatorProps = {
	className?: string,
	flex?: number,
	style?: Object,
	type?: 'spacer' | 'line' | 'flex-spacer',
};

export default function Separator(props: SeparatorProps) {
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
        renderedStyle = { ...renderedStyle, borderWidth: '1px' }
    }
    else if (type === 'spacer') {
        renderedStyle = { ...renderedStyle, padding: '0 0.5em' }
    }
    else if (type === 'flex-spacer') {
        renderedStyle = { ...renderedStyle, flex }
    }

    return (
		<hr
    className={cx('separator', className)}
    style={renderedStyle}
		/>
    )
}
