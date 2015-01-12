import React from 'react'
import {map} from 'lodash'
import {oxford, pluralize} from 'humanize-plus'

import CourseTitle from '../components/courseTitle'
import studentActions from '../flux/studentActions'
import semesterName from 'sto-helpers/lib/semesterName'

let ExpandedCourse = React.createClass({
	propTypes: {
		info: React.PropTypes.object,
		student: React.PropTypes.object,
		schedule: React.PropTypes.object,
	},

	removeFromSemester() {
		studentActions.removeCourse(this.props.student.id, this.props.schedule.id, this.props.info.clbid)
	},

	render() {
		let course = this.props.info
		let tools = []

		// /////

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

		// /////

		let offerings = React.createElement('p',
			{className: 'offerings'},
			map(course.times,
				time => React.createElement('span', {key: time}, time)))

		let gereqs = React.createElement('ul',
			{className: 'gereqs'},
			map(course.gereqs,
				ge => React.createElement('li', {key: ge}, ge)))

		let description = React.createElement('p',
			{className: 'description'},
			course.desc)

		let credits = React.createElement('span',
			{className: 'credits'},
			course.credits + ' ' + pluralize(course.credits, 'credit'))

		let classInstanceOffered = React.createElement('span',
			{className: 'instance'},
			semesterName(course.sem) + ' ' + course.year)

		let info = React.createElement('p',
			{className: 'info'},
			credits, classInstanceOffered)

		let details = React.createElement('div',
			{className: 'details'},
			offerings, gereqs, description, info)

		// /////

		let semesterList = React.createElement('select',
			{className: 'semester-select', key: 'semester-select'},
			map(findSemesterList(), (s =>
				React.createElement('option', {value: s.id, key: s.id}, s.title))))
		tools.push(semesterList)

		let deleteButton = React.createElement('button', {className: 'remove-course', onClick: this.removeFromSemester, key: 'remove-course'}, 'Remove Course')
		if (this.props.schedule) {
			tools.push(deleteButton)
		}

		let toolsEls = React.createElement('div',
			{className: 'tools', onClick: (ev) => {ev.stopPropagation()}},
			tools)

		// /////

		return React.createElement('div', {className: 'info-rows'}, title, summary, details, toolsEls)
	},
})

export default ExpandedCourse
