// @flow
import React from 'react'
import styled, {keyframes} from 'styled-components'
import cx from 'classnames'

const divCount = 5

const stretchDelay = keyframes`
	0%,
	40%,
	100% {
		transform: scaleY(0.4);
	}
	20% {
		transform: scaleY(1);
	}
`

const Spinner = styled.div`
	width: 30px;
	height: 27px;

	& > div {
		background-color: currentColor;
		height: 100%;
		width: 6px;
		display: inline-block;

		animation: ${stretchDelay} 1.2s infinite ease-in-out;
	}

	& > div:nth-child(2) {
		animation-delay: -1.1s;
	}

	& > div:nth-child(3) {
		animation-delay: -1s;
	}

	& > div:nth-child(4) {
		animation-delay: -0.9s;
	}

	& > div:nth-child(5) {
		animation-delay: -0.8s;
	}
`

const Wrapper = styled.figure`
	margin: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column nowrap;

	color: var(--gray-600);

	&.info {
		color: var(--green-600);
	}
	&.warning {
		color: var(--orange-600);
	}
	&.error {
		color: var(--red-600);
	}
`

const Message = styled.figcaption`
	font-weight: 300;
	margin-top: 1em;
`

type LoadingProps = {
	children?: any,
	error?: boolean,
	info?: boolean,
	warning?: boolean,
}

export default function Loading({
	info,
	error,
	warning,
	children,
}: LoadingProps) {
	return (
		<Wrapper className={cx({info, error, warning})}>
			<Spinner>
				{[...Array(divCount)].map((_, idx) => (
					<div key={idx} />
				))}
			</Spinner>
			<Message>{children}</Message>
		</Wrapper>
	)
}
