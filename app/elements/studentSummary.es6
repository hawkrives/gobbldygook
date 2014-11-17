'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as humanize from 'humanize-plus'

import ContentEditable from './contentEditable.es6'

import add from '../helpers/add.es6'
import randomChar from '../helpers/randomChar.es6'

let goodGraduationMessage = 'It looks like you\'ll make it! Just follow the plan, and go over my output with your advisor a few times.'
let badGraduationMessage = 'You haven\'t planned everything out yet. Ask your advisor if you need help fitting everything in.'

var StudentSummary = React.createClass({
	displayName: 'StudentSummary',

	updateStudentName(ev) {
		var newName = ev.target.value;
		this.props.student.name = newName;
	},

	render() {
		var student = this.props.student
		var studies = student.studies.data
		var name = student.name || randomChar()
		var nameEl = React.createElement(ContentEditable, {
			html: name,
			onChange: this.updateStudentName
		})
		var has = _.mapValues(_.groupBy(studies, 'type'), _.size)

		let objects = {
			degree: _.filter(studies, {type: 'degree'}),
			major: _.filter(studies, {type: 'major'}),
			concentration: _.filter(studies, {type: 'concentration'}),
			emphasis: _.filter(studies, {type: 'emphasis'}),
		}

		let titles = {
			degree: humanize.oxford(_.pluck(objects.degree, 'title')),
			major: humanize.oxford(_.pluck(objects.major, 'title')),
			concentration: humanize.oxford(_.pluck(objects.concentration, 'title')),
			emphasis: humanize.oxford(_.pluck(objects.emphasis, 'title')),
		}

		let words = {
			degree: humanize.pluralize(_.size(objects.degree), 'degree'),
			major: humanize.pluralize(_.size(objects.major), 'major'),
			concentration: humanize.pluralize(_.size(objects.concentration), 'concentration'),
			emphasis: humanize.pluralize(_.size(objects.emphasis), 'emphasis', 'emphases'),
		}

		// var canGraduate = checkElegibilityForGraduation(this.props)
		var canGraduate = false

		let phrases = {
			degree: React.createElement('span', {className: 'area-of-study-list', key:'degree'}, titles.degree),
			major: React.createElement('span', {className: 'area-of-study-list', key:'major'}, titles.major),
			concentration: React.createElement('span', {className: 'area-of-study-list', key:'concentration'}, titles.concentration),
			emphasis: React.createElement('span', {className: 'area-of-study-list', key:'emphasis'}, titles.emphasis),
		}

		var majorEmphasizer = has.major === 1 ? 'a ' : ''
		var concentrationEmphasizer = has.concentration === 1 ? 'a ' : ''
		var emphasisEmphasizer = has.emphasis === 1 ? 'an ' : ''

		return React.createElement('article', {id: 'student-summary', className: canGraduate ? 'can-graduate' : 'cannot-graduate'},
			React.createElement('div', {key: 'letter', id: 'student-letter'}, name[0]),
			React.createElement('p', {key: 'hi'}, 'Hi, ', nameEl, '!'),
			React.createElement('p', {key: 'overview'},
				'You are planning on ', _.size(objects.degree === 1) ? 'a ' : '',
				phrases.degree, ' ', words.degree, ', with ', majorEmphasizer, words.major, ' in ', phrases.major,
				has.concentration > 0 ? [', and ' + concentrationEmphasizer + words.concentration + ' in ', phrases.concentration] : '',
				has.emphasis > 0 ? [', not to mention ', emphasisEmphasizer, words.emphasis, ' in ', phrases.emphasis] : '',
				'.'),
			React.createElement('p', {key: 'message', className: 'graduation-message'},
				canGraduate ? goodGraduationMessage : badGraduationMessage)
		)
	}
})

export default StudentSummary
