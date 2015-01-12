import React from 'react'

let CourseTitle = React.createClass({
	propTypes: {
		info: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			name: React.PropTypes.string,
			type: React.PropTypes.string,
		}),
	},
	render() {
		let course = this.props.info

		let titleText = course.title
		let type = course.type
		let courseName = course.name || course.title

		if (course.type === 'Topic')
			titleText = courseName.replace(/top.*: */gi, '')

		let isIndependent = /^I[RS]/.test(courseName)
		if (isIndependent) {
			type = courseName.substr(0, 3)
			if (courseName.length > 3)
				titleText = courseName.substring(3)
		}

		let courseType = React.createElement('span', {className: 'type'}, type)
		let title = React.createElement('h1',
			{className: 'title'},
			(type === 'Research' && !isIndependent) ? null : courseType,
			titleText)

		return title
	},
})

export default CourseTitle
