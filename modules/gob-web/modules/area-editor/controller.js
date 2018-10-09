// @flow

import * as React from 'react'
import {Card} from '../../components/card'
import styled from 'styled-components'
import {enhanceHanson} from '@gob/hanson-format'
import yaml from 'js-yaml'
import Component2 from '@reach/component-component'
import stabilize from 'stabilize'
import LZString from 'lz-string'
import {Editor} from './editor'
import {PlainAreaOfStudy} from '../area-of-study'

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

class AreaInfoViewer extends React.Component<any> {
	render() {
		if (!this.props.value) {
			return <p>No data entered</p>
		}

		try {
			let data: any = yaml.safeLoad(this.props.value || '')
			data = enhanceHanson(data)

			let {name, revision, type} = data
			let areaOfStudy = {name, revision, type}

			return (
				<Card>
					<PlainAreaOfStudy
						areaOfStudy={areaOfStudy}
						results={(data: any)}
						style={{flex: 1}}
					/>
				</Card>
			)
		} catch (err) {
			return (
				<Card>
					<p style={{whiteSpace: 'pre-wrap'}}>{err.message}</p>
				</Card>
			)
		}
	}
}

const Layout = styled.div`
	display: grid;
	margin: 0 1em 1em;
	grid-template-columns: 1fr 1fr 280px;
	grid-column-gap: 1em;
	align-content: stretch;
	height: 100%;
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
						<AreaInfoViewer value={content} />
					</>
				)
			}}
		/>
	</Layout>
)
