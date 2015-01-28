import React from 'react'

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
		if (this.props.onChange && ev.target.value !== this.state.content) {
			this.props.onChange(ev)
		}
		this.setState({content: ev.target.value})
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
