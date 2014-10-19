'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import add from '../helpers/add'

var StudentSummary = React.createClass({
	render() {
		// console.log('student-summary render')
		var student = this.props
		var studies = student.studies
		var name = student.name

		var degreeObjects = _.filter(studies, {type: 'degree'})
		var majorObjects = _.filter(studies, {type: 'major'})
		var concentrationObjects = _.filter(studies, {type: 'concentration'})
		var emphasisObjects = _.filter(studies, {type: 'emphasis'})

		var has = _.mapValues(_.groupBy(studies, 'type'), _.size)

		var degrees = humanize.oxford(_.pluck(degreeObjects, 'title'))
		var majors = humanize.oxford(_.pluck(majorObjects, 'title'))
		var concentrations = humanize.oxford(_.pluck(concentrationObjects, 'title'))
		var emphases = humanize.oxford(_.pluck(emphasisObjects, 'title'))

		var degreeWord = humanize.pluralize(_.size(degreeObjects), 'degree')
		var majorWord = humanize.pluralize(_.size(majorObjects), 'major')
		var concentrationWord = humanize.pluralize(_.size(concentrationObjects), 'concentration')
		var emphasisWord = humanize.pluralize(_.size(emphasisObjects), 'emphasis', 'emphases')

		// var canGraduate = checkElegibilityForGraduation(this.props)
		var canGraduate = false

		var degreePhrase = React.DOM.span({className: 'area-of-study-list'}, degrees)
		var majorPhrase = React.DOM.span({className: 'area-of-study-list'}, majors)
		var concentrationPhrase = React.DOM.span({className: 'area-of-study-list'}, concentrations)
		var emphasisPhrase = React.DOM.span({className: 'area-of-study-list'}, emphases)

		var emphasisEmphasizer = has.emphasis > 0 && has.emphasis < 2 ? 'an ' : ''

		return React.DOM.article({id: 'student-summary', className: canGraduate ? 'can-graduate' : 'cannot-graduate'},
			React.DOM.div({id: 'student-letter'}, name[0]),
			React.DOM.p({key: 'hi'}, 'Hi, ', name, '!'),
			React.DOM.p({key: 'overview'},
				'You are planning on ', _.size(degreeObjects === 1) ? 'a ' : '', degreePhrase,
				' ', degreeWord, ', with ', majorWord, ' in ', majorPhrase,
				has.concentration > 0 ? [', and ', concentrationWord, ' in ', concentrationPhrase] : '',
				has.emphasis > 0 ? [', not to mention ', emphasisEmphasizer, emphasisWord, ' in ', emphasisPhrase] : '',
				'.'),
			React.DOM.p({key: 'message', className: 'graduation-message'},
				canGraduate ?
				'It looks like you\'ll make it! Just follow the plan, and go over my output with your advisor a few times.' :
				'You haven\'t planned everything out yet. Ask your advisor if you need help fitting everything in.')
		)
	}
})

export default StudentSummary
