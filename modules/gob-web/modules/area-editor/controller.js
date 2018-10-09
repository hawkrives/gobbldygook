// @flow

import * as React from 'react'
import styled from 'styled-components'
import {enhanceHanson} from '@gob/hanson-format'
import yaml from 'js-yaml'
import Component2 from '@reach/component-component'
import stabilize from 'stabilize'
import LZString from 'lz-string'
import {Editor} from './editor'

function read() {
	const hash = document.location.hash.slice(1)

	if (!hash) {
		return {}
	}

	try {
		return JSON.parse(LZString.decompressFromEncodedURIComponent(hash))
	} catch (_) {
		return {}
	}
}

function replace(state) {
	const hash = LZString.compressToEncodedURIComponent(stabilize(state))

	const url = new URL((document.location: any))
	url.hash = hash
	window.history.replaceState(null, null, url)
}

class AreaTextEditor extends React.Component<any, any> {
	render() {
		let {value, onChange} = this.props
		return (
			<Editor
				value={value}
				onBeforeChange={(editor, data, value) => {
					onChange(value)
				}}
				mode="yaml"
			/>
		)
	}
}

class AreaCompiledViewer extends React.Component<any> {
	render() {
		try {
			let data: any = yaml.safeLoad(this.props.value || '')
			let value = ''

			if (data) {
				data = enhanceHanson(data)
				value = JSON.stringify(data, null, 2)
			}

			return (
				<Editor
					value={value}
					options={{readOnly: true}}
					mode={{name: 'javascript', json: true}}
				/>
			)
		} catch (err) {
			return (
				<Editor
					value={err.message}
					options={{readOnly: true}}
					mode="text"
				/>
			)
		}
	}
}

const Layout = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 1em;
	align-content: center;
`

export let Controller = () => (
	<Layout>
		<Component2
			initialState={{content: '', ...read()}}
			didUpdate={({state, prevState}) => {
				if (state.content !== prevState.content) {
					replace({content: state.content})
				}
			}}
			render={({state: {content}, setState}) => {
				return (
					<>
						<AreaTextEditor
							value={content}
							onChange={value => setState({content: value})}
						/>
						<AreaCompiledViewer value={content} />
					</>
				)
			}}
		/>
	</Layout>
)
