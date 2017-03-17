// @flow
import React from 'react'
import styled from 'styled-components'

type IconProps = {|
    children?: any,
    block?: boolean,
|};

const IconBase = styled.svg`
    .icon {
        width: 1em;
        height: 1em;

        fill: currentColor;
        display: ${({block}) => block ? 'block' : 'inline-block'};
        vertical-align: middle;

        margin: auto;
    }
`

export default function Icon(
    { children, block }: IconProps
) {
    return (
        <IconBase
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            block={block}
        >
            {children}
        </IconBase>
    )
}
