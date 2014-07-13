var _ = require('lodash')
var React = require('react')

var CourseList = require('./courseList')
var Course = require('./course')

var makeCourseObjects = require('../helpers/makeCourseObjects')

var Semester = React.createClass({
	makeSemesterName: function() {
		if      (this.props.semester === 1) return 'Fall';
		else if (this.props.semester === 2) return 'Interim';
		else if (this.props.semester === 3) return 'Spring';
		else if (this.props.semester === 4) return 'Early Summer';
		else if (this.props.semester === 5) return 'Late Summer';

		return 'Unknown (' + this.props.semester + ')';
	},
	findActiveSchedules: function() {
		var activeSchedules = this.props.schedules.find(function(schedule) {
			if (schedule.active)
				return schedule.active.val() === true
		})
		return activeSchedules || this.props.schedules[0]
	},
	removeSemester: function() {
		console.log('deleting', String(this.props.year) + '.' + String(this.props.semester))
		console.log(this.props.schedule)
		this.props.schedule.remove()
	},
	render: function() {
		console.log('semester render')

		var semesterName = this.makeSemesterName()
		var active = this.findActiveSchedules()
		var courseObjects = makeCourseObjects(_.uniq(active.val().clbids))

		return React.DOM.div( {className:"semester"},
			React.DOM.header({className: "semester-title"},
				React.DOM.h1(null, semesterName, ' (' + _.size(this.props.schedules) + ')'),
				React.DOM.button({
					className: "remove-semester",
					title: "Remove " + String(this.props.year) + ' ' + this.props.semesterName,
					onClick: this.removeSemester,
				})
			),
			CourseList( {courses: courseObjects} )
		)
	}
})

module.exports = Semester
