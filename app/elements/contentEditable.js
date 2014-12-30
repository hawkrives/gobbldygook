import * as React from 'react'

var ContentEditable = React.createClass({
	// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
	propTypes: {
		onChange: React.PropTypes.func,
		html: React.PropTypes.string,
	},
	render() {
		return React.createElement('span', {
			onInput: this.emitChange,
			onBlur: this.emitChange,
			contentEditable: true,
			dangerouslySetInnerHTML: {__html: this.props.html},
		})
	},
	shouldComponentUpdate(nextProps) {
		return nextProps.html !== this.getDOMNode().innerHTML;
	},
	componentWillUpdate(nextProps) {
		if (nextProps.html !== this.getDOMNode().innerHTML) {
			this.getDOMNode().innerHTML = nextProps.html;
		}
	},
	emitChange() {
		var html = this.getDOMNode().innerHTML;
		if (this.props.onChange && html !== this.lastHtml) {
			this.props.onChange({target: {value: html}});
		}
		this.lastHtml = html;
	},
});

export default ContentEditable
