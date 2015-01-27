import React from 'react'

let ContentEditable = React.createClass({
	// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
	propTypes: {
		onChange: React.PropTypes.func,
		content: React.PropTypes.string,
	},

	shouldComponentUpdate(nextProps) {
		return nextProps.content !== this.getDOMNode().innerHTML
	},

	componentWillUpdate(nextProps) {
		if (nextProps.content !== this.getDOMNode().innerHTML) {
			this.getDOMNode().innerHTML = nextProps.content
		}
	},

	emitChange() {
		let content = this.getDOMNode().innerHTML
		if (this.props.onChange && content !== this.lastHtml) {
			this.props.onChange({target: {value: content}})
		}
		this.lastHtml = content
	},

	render() {
		return React.createElement('span', {
			className: 'contenteditable',
			onInput: this.emitChange,
			onBlur: this.emitChange,
			contentEditable: true,
			dangerouslySetInnerHTML: {__html: this.props.content},
		})
	},
})

export default ContentEditable
