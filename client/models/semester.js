var _ = require('lodash')
var React = require('react')

var CourseList = require('./courseList')
var Course = require('./course')

var getCourses = require('../helpers/getCourses').getCourses

var isCurrentTermSchedule = _.curry(function(year, semester, schedule) {
	return (schedule.year.val() === year && schedule.semester.val() === semester)
})

var Semester = React.createClass({
	putActiveCoursesIntoState: function() {
		var active = this.findActiveSchedules()
		var clbids = _.uniq(active.val().clbids)

		var self = this
		getCourses(clbids).then(function(courses) {
			console.log('retrieved ' + courses.length + ' courses for semester')
			self.setState({
				courses: courses
			})
		})
	},
	getInitialState: function() {
		return {
			courses: []
		}
	},
	componentWillReceiveProps: function() {
		this.putActiveCoursesIntoState()
	},
	componentDidMount: function() {
		this.putActiveCoursesIntoState()
	},
	semesterName: function() {
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
		// var year = this.props.year, semester = this.props.semester
		// this.props.schedules.forEach(function(schedule, index, schedules) {
		// 	if (isCurrentTermSchedule(year, semester, schedule)) {
		// 		schedules.removeAt(index)
		// 	}
		// })
	},
	render: function() {
		console.log('semester render')

		return React.DOM.div( {className:"semester"},
			React.DOM.header({className: "semester-title"},
				React.DOM.h1(null, this.semesterName()),
				React.DOM.button({
					className: "remove-semester",
					title: "Remove " + String(this.props.year) + ' ' + this.semesterName(),
					onClick: this.removeSemester,
				})
			),
			CourseList( {courses: this.state.courses} )
		)
	}
})

module.exports = Semester
