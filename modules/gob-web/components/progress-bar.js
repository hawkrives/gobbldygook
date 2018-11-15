// @flow
import React from 'react'
import styled from 'styled-components'
import {findWordForProgress} from '@gob/lib'
import * as theme from '../theme'

const colorMap = {
	hundred: theme.green300,
	ninety: theme.orange300,
	eighty: theme.orange300,
	seventy: theme.orange300,
	sixty: theme.yellow700,
	fifty: theme.yellow600,
	forty: theme.yellow600,
	thirty: theme.amber500,
	twenty: theme.red300,
	ten: theme.red300,
	'under-ten': theme.red300,
}

const Bar = styled.div`
	border: 1px solid currentColor;
	border-radius: 3px;
	background-color: white;
	width: 100%;

	color: ${props =>
		props.colorful && colorMap[props.percent]
			? colorMap[props.percent]
			: theme.gray300};
`

const BarTrack = styled.div`
	height: 100%;
	width: 100%;
`

const BarFill = styled.div`
	background-color: currentColor;
	max-width: 100%;
	height: 100%;
`

type Props = {
	className?: string,
	colorful?: boolean,
	max?: number,
	value: number,
}

export default function ProgressBar(props: Props) {
	const {value, max = 1, colorful, className} = props

	const width = 100 * (value / max)
	const progressWord = findWordForProgress(max, value)

	return (
		<Bar className={className} percent={progressWord} colorful={colorful}>
			<BarTrack>
				<BarFill style={{width: `${width}%`}} />
			</BarTrack>
		</Bar>
	)
}
