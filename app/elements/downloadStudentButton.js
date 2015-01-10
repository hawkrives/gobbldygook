import React from 'react'

let downloadStudentButton = React.createClass({
	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	render() {
		let url = `data:text/json;charset=utf-8,${this.props.student.encode()}`

		let link = React.createElement('a',
			{href: url, download: `${this.props.student.name}.gb-student.json`},
			'Download')

		return React.createElement('button', {className: 'download-student'}, link)
	}
})

export default downloadStudentButton
