// @flow
import React from 'react'
import styled from 'styled-components'

export const InlineIcon = styled.svg.attrs({
    xmlns: 'http://www.w3.org/2000/svg',
    width: '512',
    height: '512',
    viewBox: '0 0 512 512',
})`
    width: 1em;
    height: 1em;

    fill: currentColor;
    display: inline-block;
    vertical-align: middle;

    margin: auto;
`

export const BlockIcon = InlineIcon.extend`
    display: block;
`

type Props = {
    children?: any,
    className?: string,
    style?: Object,
    type?: 'block' | 'inline',
}

export default function Icon(props: Props) {
    const {className, style, children, type = 'inline'} = props
    const Tag = type === 'block' ? BlockIcon : InlineIcon

    return (
        <Tag
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
            className={`icon icon--${type} ${className || ''}`}
            style={style}
        >
            {children}
        </Tag>
    )
}
