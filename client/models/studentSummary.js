var _ = require('lodash');
var React = require('react');

var add = require('../helpers/add')
var countCredits = require('../helpers/countCredits')
var humanize = require('humanize-plus')
var checkElegibilityForGraduation = require('../helpers/checkElegibilityForGraduation')

var StudentSummary = React.createClass({
	render: function() {
		console.log('student-summary render')

		var creditsTaken = countCredits(this.props.courses)
		var creditsNeeded = this.props.creditsNeeded

		var degreeObjects = _.filter(this.props.studies, {type: 'degree'})
		var majorObjects = _.filter(this.props.studies, {type: 'major'})
		var concentrationObjects = _.filter(this.props.studies, {type: 'concentration'})

		var degrees = humanize.oxford(_.pluck(degreeObjects, 'title'))
		var majors = humanize.oxford(_.pluck(majorObjects, 'title'))
		var concentrations = humanize.oxford(_.pluck(concentrationObjects, 'title'))

		var degreeWord = humanize.pluralize(_.size(degreeObjects), 'degree')
		var majorWord = humanize.pluralize(_.size(majorObjects), 'major')
		var concentrationWord = humanize.pluralize(_.size(concentrationObjects), 'concentration')

		var canGraduate = checkElegibilityForGraduation(this.props)

		return React.DOM.section( {id: 'student-summary', className: canGraduate ? 'can-graduate' : 'cannot-graduate'},
			React.DOM.div( {id: 'student-letter' }, this.props.name[0] ),
			React.DOM.p(null, "Hi, ", this.props.name, "!"),
			React.DOM.p(null, 
				"You are planning on ", 
				degrees, " ", degreeWord, 
				", with ", majorWord, " in ",
				majors, ", and ", concentrationWord, 
				" in ", concentrations, "."),
			React.DOM.p(null, canGraduate ? "It looks like you'll make it! Just follow the plan, and double-check my output with your advisor a few times." : "You haven't managed to plan everything out yet. Ask your advisor if you need help fitting everything in."),
			React.DOM.p(null, "You have ", React.DOM.output(null, creditsTaken), " of ", React.DOM.output(null, creditsNeeded), " credits.")
		)
	}
})

module.exports = StudentSummary
