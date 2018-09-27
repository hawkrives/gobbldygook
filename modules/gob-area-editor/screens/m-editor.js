// @flow

import * as React from 'react'
import styled from 'styled-components'
import {MonacoEditor} from '../components/monaco'
import {enhanceHanson} from '@gob/hanson-format'
import yaml from 'js-yaml'
import Component2 from '@reach/component-component'

import stabilize from 'stabilize'
import LZString from 'lz-string'

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

const StyledEditor = styled(MonacoEditor)`
	border: solid 1px #444;
	border-radius: 4px;
	margin: 1em;
	padding: 0 0.5em;
`

const Layout = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: 1em;
	align-content: center;
	grid-row-gap: 1em;
	grid-template-rows: max-content 500px;
`

const GridArea = styled.div`
	${({column}) => `grid-column: ${column};`};
`

const DefaultEditor = props => (
	<StyledEditor
		theme="vs-dark"
		width="100%"
		height="100%"
		options={{selectOnLineNumbers: true}}
		{...props}
	/>
)

class AreaTextEditor extends React.Component<any, any> {
	render() {
		let {value, onChange} = this.props
		return (
			<DefaultEditor value={value} onChange={onChange} language="yaml" />
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

			return <DefaultEditor value={value} language="json" />
		} catch (err) {
			return <DefaultEditor value={err.message} language="text" />
		}
	}
}

export let Editor = () => (
	<Layout>
		<GridArea column="1 / -1" row={1}>
			<h1 style={{margin: 0}}>Area of Study Editor</h1>
		</GridArea>

		<Component2
			initialState={{content: '', ...read()}}
			didUpdate={({state, prevState}) => {
				// console.log(state, nextState, prevState)
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
