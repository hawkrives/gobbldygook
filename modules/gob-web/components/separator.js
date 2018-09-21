// @flow
import React from 'react'
import styled from 'styled-components'

const Rule = styled.hr`
    display: flex
    height: 100%;
    align-self: stretch;
    margin: 0;
    border-width: 0;
`

const LineRule = Rule.extend`
	border-width: 1px;
`

const SpacerRule = Rule.extend`
	padding: 0 0.5em;
`

const FlexSpacerRule = Rule.extend`
	flex: ${props => props.flex};
`

type Props = {
	className?: string,
	flex?: number,
	style?: Object,
	type?: 'spacer' | 'line' | 'flex-spacer',
}

export default function Separator(props: Props) {
	const {className, flex = 1, style, type = 'spacer'} = props

	let ChosenRule = Rule
	if (type === 'line') {
		ChosenRule = LineRule
	} else if (type === 'spacer') {
		ChosenRule = SpacerRule
	} else if (type === 'flex-spacer') {
		ChosenRule = FlexSpacerRule
	}

	return <ChosenRule flex={flex} className={className} style={style} />
}
