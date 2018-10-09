// @flow

import * as React from 'react'
import styled from 'styled-components'
import {Controlled as CodeMirror} from 'react-codemirror2'
import {Card} from '../../components/card'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

const StyledEditor = styled(CodeMirror)`
	padding: 0;
	flex: 1;

	display: flex;
	flex-flow: column;

	.CodeMirror {
		flex: 1;
		cursor: text;
	}
`

export const Editor = (props: any) => (
	<Card style={{overflow: 'hidden', display: 'flex'}}>
		<StyledEditor
			{...props}
			options={{
				lineNumbers: true,
				extraKeys: {
					Tab(cm) {
						cm.replaceSelection('   ', 'end')
					},
				},
				...(props.options || {}),
			}}
		/>
	</Card>
)
