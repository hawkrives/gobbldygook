'use strict';

import * as React from 'react'

var ContentEditable = React.createClass({
	render() {
		return React.createElement('span', {
			onInput: this.emitChange,
			onBlur: this.emitChange,
			contentEditable: true,
			dangerouslySetInnerHTML: {__html: this.props.html}})
	},
	shouldComponentUpdate(nextProps){
		return nextProps.html !== this.getDOMNode().innerHTML;
	},
	componentWillUpdate(nextProps) {
		if (nextProps.html !== this.getDOMNode().innerHTML) {
			this.getDOMNode().innerHTML = nextProps.html;
		}
	},
	emitChange(){
		var html = this.getDOMNode().innerHTML;
		if (this.props.onChange && html !== this.lastHtml) {
			this.props.onChange({
				target: {value: html}
			});
		}
		this.lastHtml = html;
	},
});

var App = React.createClass({
	getInitialState: function(){
		return {html: "this is <em>an</em> example"};
	},
	handleChange(ev) {
		this.setState({html: ev.target.value});
		console.log(ev.target.value)
	},
	render: function(){
		return React.createElement(ContentEditable, {
			html: this.state.html,
			onChange: this.handleChange
		})
	},
});

export default ContentEditable

