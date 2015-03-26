import React from 'react'

let CourseTitle = React.createClass({
	propTypes: {
		info: React.PropTypes.shape({
			title: React.PropTypes.string,
			name: React.PropTypes.string.isRequired,
			type: React.PropTypes.string,
		}),
		onClick: React.PropTypes.func,
	},
	getDefaultProps() {
		return {
			onClick() {}
		}
	},
	render() {
		let course = this.props.info

		let type = course.type
		let isIndependent = /^I[RS]/.test(course.name)

		let courseName = course.title || course.name

		if (isIndependent) {
			courseName = course.name
			type = courseName.substr(0, 3)
			if (courseName.length > 3)
				courseName = courseName.substring(3)
		}
		else if (type === 'Topic') {
			courseName = course.name
			courseName = courseName.replace(/top.*: */gi, '')
		}

		return <h1 className='title'>{courseName}</h1>
	},
})

export default CourseTitle
