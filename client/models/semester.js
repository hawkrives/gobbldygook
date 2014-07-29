var _ = require('lodash')
var React = require('react')
var humanize = require('humanize-plus')

var CourseList = require('./courseList')
var Course = require('./course')

var getCourses = require('../helpers/getCourses').getCourses
var checkScheduleTimeConflicts = require('../helpers/time').checkScheduleTimeConflicts

var isCurrentTermSchedule = _.curry(function(year, semester, schedule) {
	return (schedule.year.val() === year && schedule.semester.val() === semester)
})

var Semester = React.createClass({
	putActiveCoursesIntoState: function() {
		var active = this.findActiveSchedules().val()
		var clbids = _.uniq(active.clbids)

		var self = this
		return getCourses(clbids).then(function(courses) {
			self.setState({
				courses: courses
			})
		})
	},
	getInitialState: function() {
		return {
			courses: [],
			isValid: true,
			conflicts: []
		}
	},
	componentWillReceiveProps: function() {
		this.putActiveCoursesIntoState().then(this.validateSchedule)
	},
	componentDidMount: function() {
		this.putActiveCoursesIntoState().then(this.validateSchedule)
	},
	semesterName: function() {
		if      (this.props.semester === 1) {return 'Fall'}
		else if (this.props.semester === 2) {return 'Interim'}
		else if (this.props.semester === 3) {return 'Spring'}
		else if (this.props.semester === 4) {return 'Early Summer'}
		else if (this.props.semester === 5) {return 'Late Summer'}

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
	validateSchedule: function() {
		// Checks to see if the schedule is valid

		// Step one: do any times conflict?
		var courses = this.state.courses
		var conflicts = checkScheduleTimeConflicts(courses)

		var hasConflict = _.chain(conflicts)
			.toArray() // turn the object into an array
			.map(_.toArray) // and each of the nested objects, too
			.flatten() // flatten the nested arrays
			.any() // and see if any of the resulting values are true
			.value()

		this.setState({
			isValid: !hasConflict,
			conflicts: conflicts
		})

		console.log('schedule conflicts', conflicts, hasConflict)

		return _.any([hasConflict])
	},
	render: function() {
		return React.DOM.div({className: 'semester'},
			React.DOM.header({className: 'semester-title'},
				React.DOM.h1(null, this.semesterName()),
				React.DOM.ul({className: 'bar'},
					React.DOM.li(
						{className: 'semester-course-count'},
						_.size(this.state.courses) + ' ' + humanize.pluralize(_.size(this.state.courses), 'course')
					),
					this.state.isValid ? null : React.DOM.li(
						{className: 'semester-status'},
						this.state.conflicts
					)
				),
				React.DOM.button({
					className: 'remove-semester',
					title: 'Remove ' + String(this.props.year) + ' ' + this.semesterName(),
					onClick: this.removeSemester,
				})
			),
			CourseList({courses: this.state.courses})
		)
	}
})

module.exports = Semester
