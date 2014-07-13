var _ = require('lodash')
var React = require('react')

var CourseList = require('./courseList')
var Course = require('./course')

var makeCourseObjects = require('../helpers/makeCourseObjects')

var Semester = React.createClass({
	removeSemester: function() {
		console.log('deleting', String(this.props.year) + '.' + String(this.props.semester))
		console.log(this.props.schedule)
		this.props.schedule.remove()
	},
	render: function() {
		console.log('semester render')

		var semesterName = 'Unknown (' + this.props.semester + ')';

		if (this.props.semester === 1) {
			semesterName = 'Fall';
		} else if (this.props.semester === 2) {
			semesterName = 'Interim';
		} else if (this.props.semester === 3) {
			semesterName = 'Spring';
		} else if (this.props.semester === 4) {
			semesterName = 'Early Summer';
		} else if (this.props.semester === 5) {
			semesterName = 'Late Summer';
		}

		var courseObjects = makeCourseObjects(_.uniq(this.props.schedule.val().clbids))

		return React.DOM.div( {className:"semester"},
			React.DOM.header({className: "semester-title"},
				React.DOM.h1(null, semesterName)),
			CourseList( {courses: courseObjects} )
		)
	}
})

module.exports = Semester
