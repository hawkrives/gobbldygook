var _ = require('lodash');
var React = require('react');

var add = require('../helpers/add')
var checkElegibilityForGraduation = require('../helpers/checkElegibilityForGraduation')

var StudentSummary = React.createClass({
	render: function() {
		console.log('student-summary render')

		var creditsTaken = _.reduce(_.pluck(this.props.courses, 'credits'), add)
		var creditsNeeded = this.props.creditsNeeded

		var degrees = _.reduce(_.pluck(_.filter(this.props.studies, 'degrees'), 'abbr'), 
			concatenateStringAsEnglish)
		var majors = _.reduce(_.pluck(_.filter(this.props.studies, 'majors'), 'title'), concatenateStringAsEnglish)
		var concentrations = _.reduce(_.pluck(_.filter(this.props.studies, 'concentrations'), 'title'), concatenateStringAsEnglish)

		var canGraduate = checkElegibilityForGraduation(this.props)

		return React.DOM.article( {id: 'student-summary'},
			React.DOM.p(null, "Hi, ", this.props.name, "!"),
			You are planning on a [degrees] degree, with majors in [majors], and concentrations in [concentrations].
			It looks like you'll make it! Just follow the plan, and double-check me with your advisor a few times.
			-- or --
			You haven't managed to plan everything out yet. Ask your advisor if you need help fitting everything in.
			React.DOM.p(null, "You have ", React.DOM.output(null, creditsTaken), " of ", React.DOM.output(null, creditsNeeded), " credits!")
		)
	}
})

module.exports = StudentSummary
