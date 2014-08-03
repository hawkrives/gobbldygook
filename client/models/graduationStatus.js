'use strict';

var _ = require('lodash')
var React = require('react')
var humanize = require('humanize-plus')

var AreaOfStudy = require('./areaOfStudy')
var StudentSummary = require('./studentSummary')

var getCourses = require('../helpers/getCourses').getCourses

var GraduationStatus = React.createClass({
	putActiveCoursesIntoState: function() {
		var clbids = _.chain(this.props.student.schedules)
			.filter('active')
			.pluck('clbids')
			.flatten()
			.uniq()
			.value()

		var self = this
		getCourses(clbids).then(function(courses) {
			console.log('retrieved ' + courses.length + ' courses for graduation-status')
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
	render: function() {
		// console.log('graduation-status render')
		var student = _.merge(this.props.student, {courses: this.state.courses})

		// Get areas of study
		var areasOfStudy = _.groupBy(student.studies, 'type')
		var areasOfStudyElements = _.mapValues(areasOfStudy, function(areas) {
			return _.map(areas, function(area) {
				area = _.merge(student, area)
				area.key = area.id
				return AreaOfStudy(area)
			}, this)
		}, this)

		var sections = _.map(_.keys(areasOfStudy), function(areaType) {
			var pluralType = humanize.pluralize(2, areaType)
			return React.DOM.section({id: pluralType, key: areaType},
				React.DOM.header({className: 'area-type-heading'},
					React.DOM.h1(null, humanize.capitalize(pluralType)),
					React.DOM.button({className: 'add-area-of-study', title: 'Add ' + humanize.capitalize(areaType)})
				),
				areasOfStudyElements[areaType]
			)
		})

		return React.DOM.section({className: 'graduation-status'},
			StudentSummary(student),
			sections
		)
	}
});

module.exports = GraduationStatus
