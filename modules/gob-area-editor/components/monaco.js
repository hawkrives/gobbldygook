// @flow

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import * as React from 'react'

let noop: (...any[]) => void = () => {}

type BaseProps = {
	width?: string | number,
	height?: string | number,
	defaultValue?: string,
	language: string,
	theme?: 'vs' | 'vs-dark' | 'hc-black' | string | null,
	requireConfig?: any,
	context?: any,
}

type Props = BaseProps & {
	value?: string | null,
	options?: any,
	editorDidMount?: EditorDidMount,
	editorWillMount?: EditorWillMount,
	onChange?: ChangeHandler,
}

export class MonacoEditor extends React.Component<Props> {
	containerElement = undefined
	__currentValue = this.props.value
	__preventTriggerChangeEvent: boolean = false
	editor: ?any = null

	componentDidMount() {
		this.initMonaco()

		window.addEventListener('resize', this.handleResize)
	}

	handleResize = () => {
		if (!this.editor) {
			console.log('no editor')
			return
		}

		this.editor.layout()
	}

	componentDidUpdate(prevProps: Props) {
		let {value = null} = this.props

		if (value !== this.__currentValue) {
			// Always refer to the latest value
			this.__currentValue = value
			// Consider the situation of rendering 1+ times before the editor mounted
			if (this.editor) {
				this.__preventTriggerChangeEvent = true
				this.editor.setValue(this.__currentValue)
				this.__preventTriggerChangeEvent = false
			}
		}

		if (prevProps.language !== this.props.language) {
			if (this.editor) {
				monaco.editor.setModelLanguage(
					this.editor.getModel(),
					this.props.language,
				)
			}
		}

		if (prevProps.theme !== this.props.theme) {
			monaco.editor.setTheme(this.props.theme)
		}

		if (
			this.editor &&
			(this.props.width !== prevProps.width ||
				this.props.height !== prevProps.height)
		) {
			this.editor.layout()
		}
	}

	componentWillUnmount() {
		this.destroyMonaco()

		window.removeEventListener('resize', this.handleResize)
	}

	editorWillMount = () => {
		let {editorWillMount = noop} = this.props
		editorWillMount(monaco)
	}

	editorDidMount = editor => {
		let {editorDidMount = noop} = this.props

		editorDidMount(editor, monaco)

		editor.onDidChangeModelContent(event => {
			const value = editor.getValue()

			// Always refer to the latest value
			this.__currentValue = value

			// Only invoking when user input changed
			if (!this.__preventTriggerChangeEvent) {
				let {onChange = noop} = this.props
				onChange(value, event)
			}
		})
	}

	initMonaco = () => {
		if (!this.containerElement) {
			return
		}

		let {value: propsValue = null, defaultValue = ''} = this.props

		const value = propsValue !== null ? propsValue : defaultValue

		const {language, theme = null, options = {}} = this.props

		// Before initializing monaco editor
		this.editorWillMount()

		this.editor = monaco.editor.create(this.containerElement, {
			value,
			language,
			...options,
		})

		if (theme) {
			monaco.editor.setTheme(theme)
		}

		// After initializing monaco editor
		this.editorDidMount(this.editor)

		window.editor = this.editor
	}

	destroyMonaco = () => {
		if (this.editor) {
			this.editor.dispose()
		}
	}

	assignRef = (component: any) => {
		this.containerElement = component
	}

	render() {
		const {width = '100%', height = '100%'} = this.props

		const style = {width, height}

		return (
			<div
				ref={this.assignRef}
				style={style}
				className="react-monaco-editor-container"
			/>
		)
	}
}

export type ChangeHandler = (value: string, event: any) => void

export type EditorDidMount = (editor: any, monaco: any) => void

export type EditorWillMount = (monaco: any) => void
