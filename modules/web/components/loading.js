// @flow
import React from 'react'
import styled, {keyframes} from 'styled-components'
import * as theme from '../theme'

const Wrapper = styled.figure`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
`

const spin = keyframes`
    to {
        transform: rotate(1turn);
    }
`

const Spinner = styled.div`
    --size: 5em;
    --segment-width: 0.5em;
    --segment-length: 1.5em;
    --font-size: 24px;

    position: relative;
    display: inline-block;
    margin: 0 0.5em;

    width: var(--size);
    height: var(--size);
    font-size: var(--font-size);

    animation: ${spin} 1s infinite steps(8);

    span {
        opacity: 0;
    }

    &::before,
    &::after,
    & > div::before,
    & > div::after {
        --width: calc(var(--size) - var(--segment-width));
        content: '';
        position: absolute;
        top: 0;
        left: calc(var(--width) / 2); /* (container width - part width) / 2 */
        width: var(--segment-width);
        height: var(--segment-length);
        border-radius: 0.2em;
        background: #ddd;
        box-shadow: 0 calc(var(--size) - var(--segment-length)) #ddd; /* container height - part height */
        transform-origin: 50% var(--size / 2); /* container height / 2 */
    }

    &::before {
        background: #555;
    }

    &::after {
        transform: rotate(-45deg);
        background: #777;
    }

    & > div::before {
        transform: rotate(-90deg);
        background: #999;
    }

    & > div::after {
        transform: rotate(-135deg);
        background: #bbb;
    }
`

const Message = styled.figcaption`
    font-weight: 300;
    margin-top: 1em;
    color: ${theme.gray};

    &.info {
        color: ${theme.green};
    }
    &.warning {
        color: ${theme.orange};
    }
    &.error {
        color: ${theme.red};
    }
`

type LoadingProps = {
    children?: any,
    className?: string,
}

export default function Loading({className, children}: LoadingProps) {
    return (
        <Wrapper>
            <Spinner>
                <div />
            </Spinner>
            <Message className={className}>{children}</Message>
        </Wrapper>
    )
}
