import * as React from 'react'
import {State, RouteHandler} from 'react-router'

import GraduationStatus from 'elements/graduationStatus'
import CourseTable from 'elements/courseTable'

var Student = React.createClass({
	mixins: [State],
	render() {
		// console.info('student render', this.props.students)
		let queryId = this.getQuery().id
		let student = this.props.students.find((student) => student.id === queryId)

		let isSearching = this.getQuery().search
		let sidebar = isSearching ?
			React.createElement(Search, {search: isSearching}) :
			React.createElement(GraduationStatus, {student, sections: this.getQuery().sections})

		let mainView = React.createElement(RouteHandler, {student})

		return React.createElement('div',
			{className: 'student'},
			sidebar,
			mainView)
	},
})

export default Student
