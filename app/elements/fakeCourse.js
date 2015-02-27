import React from 'react'

let FakeCourse = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired,
		className: React.PropTypes.string.isRequired,
	},
	render() {
		let titleEl = React.createElement('h1', {className: 'title'}, this.props.title)
		let details = React.createElement('p', {className: 'summary'}, 'no details')

		return React.createElement('article', {className: 'course ' + this.props.className},
			React.createElement('div', {className: 'info-rows'}, titleEl, details))
	},
})

export default FakeCourse
