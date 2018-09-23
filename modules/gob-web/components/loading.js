// @flow
import React from 'react'
import styled from 'styled-components'
import * as theme from '../theme'
import Spinner from 'react-spinkit'

const Wrapper = styled.figure`
	margin: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: column nowrap;
`

const Message = styled.figcaption`
	font-weight: 300;
	margin-top: 1em;
	color: var(--gray);

	&.info {
		color: var(--green);
	}
	&.warning {
		color: var(--orange);
	}
	&.error {
		color: var(--red);
	}
`

type LoadingProps = {
	children?: any,
	className?: string,
}

export default function Loading({className, children}: LoadingProps) {
	return (
		<Wrapper className={className}>
			<Spinner name="wave" color={theme.gray600} fadeIn="none" />
			<Message>{children}</Message>
		</Wrapper>
	)
}
