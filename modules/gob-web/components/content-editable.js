// @flow
import * as React from 'react'
import cx from 'classnames'

type Props = {|
	className?: string,
	disabled?: boolean,
	multiLine?: boolean,
	onBlur?: string => any,
	onChange: string => any,
	onFocus?: string => any,
	onKeyDown?: string => any,
	placeholder?: string,
	value?: string,
|}

type State = {
	lastValue: ?string,
}

// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
class ContentEditable extends React.Component<Props, State> {
	static defaultProps = {
		disabled: false,
		onChange: () => {},
		multiLine: false,
		value: '',
	}

	state = {
		lastValue: this.props.value,
	}

	handleKeyDown = (ev: KeyboardEvent) => {
		if (!(ev.target instanceof HTMLInputElement)) {
			return
		}
		if (!this.props.multiLine && ev.keyCode === 13) {
			ev.preventDefault()
		}
		this.props.onKeyDown && this.props.onKeyDown(ev.target.textContent)
	}

	handleFocus = (ev: Event) => {
		if (!(ev.target instanceof HTMLInputElement)) {
			return
		}
		this.props.onFocus && this.props.onFocus(ev.target.textContent)
		// this.ref.placeholder.style.display = 'none'
	}

	handleBlur = () => {
		// this.ref.placeholder.style.display = 'inline'
	}

	handleChange = (ev: Event) => {
		if (!(ev.target instanceof HTMLInputElement)) {
			return
		}
		const value = ev.target.textContent

		if (value !== this.props.value) {
			this.props.onChange(value)
		}
		if (ev.type === 'blur' && typeof this.props.onBlur === 'function') {
			this.props.onBlur(value)
		}

		this.setState({lastValue: value})
	}

	render() {
		return (
			<span
				className={cx('contenteditable', this.props.className)}
				onInput={this.handleChange}
				onBlur={this.handleChange}
				onKeyDown={this.handleKeyDown}
				onFocus={this.handleFocus}
				contentEditable={!this.props.disabled}
				dangerouslySetInnerHTML={{__html: this.props.value}}
			/>
		)
	}
}

export default ContentEditable
