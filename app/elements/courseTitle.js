import React from 'react'

let CourseTitle = React.createClass({
	propTypes: {
		info: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			name: React.PropTypes.string,
			num: React.PropTypes.number,
			dept: React.PropTypes.string,
			sect: React.PropTypes.string,
			type: React.PropTypes.string,
		}),
	},
	render() {
		let course = this.props.info

		let identifier = <span className='identifier'>
			{`${course.dept} ${course.num}${course.sect || ''}`}
		</span>

		let title = course.title
		let type = course.type
		let courseName = course.name || course.title

		if (type === 'Topic')
			title = courseName.replace(/top.*: */gi, '')

		let isIndependent = /^I[RS]/.test(courseName)
		if (isIndependent) {
			type = courseName.substr(0, 3)
			if (courseName.length > 3)
				title = courseName.substring(3)
		}

		return <h1 className='title'>
			{identifier}
			{title}
		</h1>
	},
})

export default CourseTitle
