import React, {PropTypes} from 'react'

import Toolbar from '../../../components/toolbar'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Separator from '../../../components/separator'

import CodeMirror from 'react-codemirror'
import 'codemirror/mode/yaml/yaml'

import './area-editor.scss'

export default function AreaEditor(props) {
	const options = {
		lineNumbers: true,
		mode: 'yaml',
	}

	return (
		<div>
			<Toolbar style={{marginBottom: '0.5em'}}>
				<Button link to='/areas' >
					<Icon name='ios-arrow-left' />
					{' '}Back
				</Button>

				<Separator type='flex-spacer' />

				<Button onClick={props.onSave}>
					<Icon name='ios-download-outline' />
					{' '}Save
				</Button>
				<Button>
					<Icon name='ios-reload' />
					{' '}Revert
				</Button>

				<Separator type='flex-spacer' />

				<Button>
					<Icon name='ios-download-outline' />
					{' '}Download
				</Button>
				<Button>
					<Icon name='ios-upload-outline' />
					{' '}Submit
				</Button>
			</Toolbar>

			<CodeMirror
				value={props.value}
				onChange={props.onChange}
				options={options}
				onFocusChange={props.onFocusChange}
			/>
		</div>
	)
}

AreaEditor.propTypes = {
	onChange: PropTypes.func.isRequired,
	onFocusChange: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
}
