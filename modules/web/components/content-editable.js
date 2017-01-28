// @flow
import React, { Component } from 'react'
import cx from 'classnames'
import debug from 'debug'
const log = debug('web:react')

// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
class ContentEditable extends Component {
	props: {
		className?: string,
		multiLine?: boolean,
		onBlur?: () => any,
		onChange: () => any,
		onFocus?: () => any,
		onKeyDown?: () => any,
		placeholder?: string,
		value?: string,
	};

	static defaultProps = {
		onChange: () => {},
		multiLine: false,
		value: '',
	};

	state = {
		lastValue: this.props.value,
	};

	handleKeyDown = (ev: KeyboardEvent) => {
		if (!this.props.multiLine && ev.keyCode === 13) {
			ev.preventDefault()
		}
		this.props.onKeyDown && this.props.onKeyDown(ev)
	};

	handleFocus = (ev: Event) => {
		this.props.onFocus && this.props.onFocus(ev)
		// this.ref.placeholder.style.display = 'none'
	};

	handleBlur = () => {
		// this.ref.placeholder.style.display = 'inline'
	};

	handleChange = (ev: any) => {
		const value = ev.target.textContent

		if (value !== this.props.value) {
			this.props.onChange({ target: { value } })
		}
		if (ev.type === 'blur' && typeof this.props.onBlur === 'function') {
			this.props.onBlur({ target: { value } })
		}

		this.setState({ lastValue: value })
	};

	render() {
		log('ContentEditable#render')
		return <span
			className={cx('contenteditable', this.props.className)}
			onInput={this.handleChange}
			onBlur={this.handleChange}
			onKeyDown={this.handleKeyDown}
			onFocus={this.handleFocus}
			contentEditable={true}
			dangerouslySetInnerHTML={{ __html: this.props.value }}
		/>
	}
}

export default ContentEditable
