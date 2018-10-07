// @flow

import styled from 'styled-components'

export const Header = styled.header`
	text-align: center;

	h1 {
		font-weight: 400;
	}
	h2 {
		font-weight: 300;
	}
`

export const Choices = styled.section`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 1em;

	button {
		margin-bottom: 1em;
	}
`
