import React from 'react'
import {oxford} from 'humanize-plus'
import CourseTitle from '../components/courseTitle'

let CollapsedCourse = React.createClass({
	propTypes: {
		info: React.PropTypes.object,
	},
	render() {
		let course = this.props.info

		let title = React.createElement(CourseTitle, this.props)

		let identifier = React.createElement('span',
			{className: 'identifier'},
			course.dept, ' ', course.num, course.sect)

		let professors = React.createElement('span',
			{className: 'professors'},
			oxford(course.profs))

		let summary = React.createElement('p',
			{className: 'summary'},
			identifier, professors)

		return React.createElement('div', {className: 'info-rows'}, title, summary)
	},
})

export default CollapsedCourse
