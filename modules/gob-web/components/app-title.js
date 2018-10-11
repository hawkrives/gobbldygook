// @flow

import React from 'react'
import styled from 'styled-components'

const Title = styled.header`
	margin-top: 3em;
	text-align: center;

	& h1,
	& h2 {
		margin: 0;
		font-variant-caps: small-caps;
	}

	& h1 {
		font-weight: 300;
	}

	& h2 {
		margin-bottom: 1em;
		font-weight: 400;
		font-size: 1em;
	}
`

export function AppTitle() {
	return (
		<Title>
			<h1>GobbldygooK</h1>
			<h2>A Course Scheduling Helper</h2>
			<small>
				<code>{process.env.TRAVIS_COMMIT}</code>
			</small>
		</Title>
	)
}
