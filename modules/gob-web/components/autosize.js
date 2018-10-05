// @flow

import * as React from 'react'
import cx from 'classnames'
import ReactInputAutosize from 'react-input-autosize'

type Props = {|
	className?: string,
	disabled?: ?boolean,
	onChange?: string => any,
	placeholder?: string,
	initialValue?: string,
	placeholder?: string,
|}

type State = {|
	value: string,
|}

// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
export class AutoSizedInput extends React.Component<Props, State> {
	state = {
		value: this.props.initialValue || '',
	}

	handleKeyDown = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		if (ev.keyCode === 13) {
			ev.preventDefault()
		}
	}

	handleChange = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		let value = ev.currentTarget.value
		console.log(value)
		this.setState(() => ({value}))
	}

	handleBlur = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		this.props.onChange && this.props.onChange(this.state.value)
	}

	render() {
		let {disabled = false} = this.props

		return (
			<ReactInputAutosize
				className={this.props.className}
				onBlur={this.handleBlur}
				onChange={this.handleChange}
				onKeyDown={this.handleKeyDown}
				disabled={disabled}
				value={this.state.value}
				placeholder={this.props.placeholder}
				placeholderIsMinWidth={true}
			/>
		)
	}
}
