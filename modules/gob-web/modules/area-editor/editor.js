// @flow

import * as React from 'react'
import styled from 'styled-components'
import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

const StyledEditor = styled(CodeMirror)`
	border: solid 1px #444;
	border-radius: 4px;
	margin: 1em;
	padding: 0;

	display: flex;
	flex-flow: column;

	.CodeMirror {
		flex: 1;
		cursor: text;
	}
`

export const Editor = (props: {[string]: {}}) => (
	<StyledEditor
		{...props}
		options={{lineNumbers: true, ...(props.options || {})}}
	/>
)
