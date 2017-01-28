import React, {PropTypes, Component} from 'react'
import cx from 'classnames'
import debug from 'debug'
const log = debug('web:react')

// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
class ContentEditable extends Component {
	static propTypes = {
		className: PropTypes.string,
		multiLine: PropTypes.bool,
		onBlur: PropTypes.func,
		onChange: PropTypes.func.isRequired,
		onFocus: PropTypes.func,
		onKeyDown: PropTypes.func,
		placeholder: PropTypes.string,
		value: PropTypes.string,
	};

	static defaultProps = {
		onChange: () => {},
		multiLine: false,
		value: '',
	};

	handleKeyDown = ev => {
		if (!this.props.multiLine && ev.keyCode === 13) {
			ev.preventDefault()
		}
		this.props.onKeyDown && this.props.onKeyDown(ev)
	};

	handleFocus = ev => {
		this.props.onFocus && this.props.onFocus(ev)
		// this.ref.placeholder.style.display = 'none'
	};

	handleBlur = () => {
		// this.ref.placeholder.style.display = 'inline'
	};

	handleChange = ev => {
		const value = ev.target.textContent

		if (value !== this.props.value) {
			this.props.onChange({target: {value}})
		}
		if (ev.type === 'blur' && typeof this.props.onBlur === 'function') {
			this.props.onBlur({target: {value}})
		}

		this.setState({lastValue: value})
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
			dangerouslySetInnerHTML={{__html: this.props.value}}
		/>
	}
}

export default ContentEditable
