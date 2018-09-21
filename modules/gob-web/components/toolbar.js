// @flow
import styled from 'styled-components'
import {FlatLinkButton} from './button'
import {InlineIcon} from './icon'

export const Toolbar = styled('div')`
	display: flex;
	flex-flow: row wrap;
	justify-content: stretch;

	${InlineIcon} {
		font-size: 1.5em;
	}
`

export const ToolbarButton = styled(FlatLinkButton)`
	flex: 1 0 auto;
	padding-left: 0.25em;
	padding-right: 0.25em;
	font-size: 1rem;
`

export const ToolbarIcon = styled(InlineIcon)`
	flex: 1 0 auto;
	padding-left: 0.25em;
	padding-right: 0.25em;
`
