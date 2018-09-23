// @flow

import styled from 'styled-components'
import {FlatButton} from './button'
import {Icon} from './icon'

export const Toolbar = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: stretch;
`

export const ToolbarButton = styled(FlatButton)`
	flex: 1 0 auto;
	padding-left: 0.25em;
	padding-right: 0.25em;
	font-size: 1rem;
`

export const ToolbarIcon = styled(Icon)`
	flex: 1 0 auto;
	padding-left: 0.25em;
	padding-right: 0.25em;
`
