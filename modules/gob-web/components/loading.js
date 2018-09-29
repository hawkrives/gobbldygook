// @flow
import React from 'react'
import styled from 'styled-components'

// className: 'sk-wave', divCount: 5

// <div {...props} className={classes}>
//   {[...Array(spinnerInfo.divCount)].map((_, idx) => <div key={idx} />)}
// </div>

const Spinner = styled.div`
  width: 30px;
  height: 27px;

  color: var(--gray-600);

& > div {
  background-color: currentColor;
  height: 100%;
  width: 6px;
  display: inline-block;

  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

& > div:nth-child(2) {
  animation-delay: -1.1s;
}

& > div:nth-child(3) {
  animation-delay: -1.0s;
}

& > div:nth-child(4) {
  animation-delay: -0.9s;
}

& > div:nth-child(5) {
  animation-delay: -0.8s;
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  } 20% {
    transform: scaleY(1.0);
  }
}

`

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
			<Spinner />
			<Message>{children}</Message>
		</Wrapper>
	)
}
