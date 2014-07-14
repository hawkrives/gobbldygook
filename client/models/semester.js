var _ = require('lodash')
var React = require('react')

var CourseList = require('./courseList')
var Course = require('./course')

var makeCourseObjects = require('../helpers/makeCourseObjects')

var isCurrentTermSchedule = _.curry(function(year, semester, schedule) {
	return (schedule.year.val() === year && schedule.semester.val() === semester)
})

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
		var possible = this.props.schedules.filter(isCurrentTermSchedule(this.props.year, this.props.semester))
		var activeSchedules = _.find(possible, function(schedule) {
			if (schedule.active) {
				return schedule.active.val() === true
			}
		})
		return activeSchedules
	},
	removeSemester: function() {
		console.log('called removeSemester')
		var indices = this.props.schedules.findIndices(isCurrentTermSchedule(this.props.year, this.props.semester))
		console.log('indices to delete', indices)
		this.props.schedules.removeSeveral(indices)
	},
	render: function() {
		console.log('semester render')

		var semesterName = this.makeSemesterName()
		var active = this.findActiveSchedules()
		var courseObjects = makeCourseObjects(_.uniq(active.val().clbids))

		return React.DOM.div( {className:"semester"},
			React.DOM.header({className: "semester-title"},
				React.DOM.h1(null, semesterName),
				React.DOM.button({
					className: "remove-semester",
					title: "Remove " + String(this.props.year) + ' ' + semesterName,
					onClick: this.removeSemester,
				})
			),
			CourseList( {courses: courseObjects} )
		)
	}
})

module.exports = Semester
