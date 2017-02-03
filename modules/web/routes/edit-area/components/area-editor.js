import React, { PropTypes } from 'react'

import Toolbar from '../../../components/toolbar'
import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Separator from '../../../components/separator'

import CodeMirror from 'react-codemirror'
import 'codemirror/mode/yaml/yaml'

import { iosArrowLeft, iosDownloadOutline, iosReload, iosUploadOutline } from '../../../icons/ionicons'
import './area-editor.scss'

export default function AreaEditor(props) {
	const options = {
		lineNumbers: true,
		mode: 'yaml',
	}

	return (
		<div>
			<Toolbar style={{ marginBottom: '0.5em' }}>
				<Button link to="/areas" >
					<Icon>{iosArrowLeft}</Icon>
					{' '}Back
				</Button>

				<Separator type="flex-spacer" />

				<Button onClick={props.onSave}>
					<Icon>{iosDownloadOutline}</Icon>
					{' '}Save
				</Button>
				<Button>
					<Icon>{iosReload}</Icon>
					{' '}Revert
				</Button>

				<Separator type="flex-spacer" />

				<Button>
					<Icon>{iosDownloadOutline}</Icon>
					{' '}Download
				</Button>
				<Button>
					<Icon>{iosUploadOutline}</Icon>
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
