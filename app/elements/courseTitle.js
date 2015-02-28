import React from 'react'

let CourseTitle = React.createClass({
	propTypes: {
		info: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			name: React.PropTypes.string,
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

		return <div>
			<h1 className='title'>{title}</h1>

		</div>
	},
})

export default CourseTitle
