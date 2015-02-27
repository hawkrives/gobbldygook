import React from 'react'
import debounce from 'lodash/function/debounce'

let ContentEditable = React.createClass({
	// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
	propTypes: {
		onChange: React.PropTypes.func,
		content: React.PropTypes.string,
	},

	componentWillReceiveProps(nextProps) {
		this.setState({content: nextProps.content})
	},

	getDefaultProps() {
		return {content: ''}
	},

	getInitialState() {
		return {content: this.props.content}
	},

	handleChange(ev) {
		let value = ev.target.value

		if (this.props.onChange && value !== this.state.content) {
			this.debounce = this.debounce || debounce((value) => {this.props.onChange({target: {value}})}, 500, {'maxWait': 1000})
			this.debounce(value)
		}

		this.setState({content: value})
	},

	render() {
		return React.createElement('input', {
			type: 'text',
			onChange: this.handleChange,
			onBlur: this.handleChange,
			value: this.state.content,
		})
	},
})

export default ContentEditable
