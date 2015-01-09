import _ from 'lodash'
import React from 'react'
import humanize from 'humanize-plus'

import ContentEditable from 'app/elements/contentEditable'

import studentActions from 'app/flux/studentActions'

let goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
let badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

let StudentSummary = React.createClass({
	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	updateStudentName(ev) {
		let newName = ev.target.value
		newName = newName.trim()
		studentActions.changeName(this.props.student.id, newName)
	},

	render() {
		let student = this.props.student
		let studies = student.studies

		let name = student.name
		let nameEl = React.createElement(ContentEditable, {
			html: name,
			onChange: this.updateStudentName,
		})

		let has = studies
			.groupBy(s => s.type)
			.map(s => s.size)
			.toObject()

		let objects = {
			degree: studies.filter(s => s.type === 'degree'),
			major: studies.filter(s => s.type === 'major'),
			concentration: studies.filter(s => s.type === 'concentration'),
			emphasis: studies.filter(s => s.type === 'emphasis'),
		}

		let titles = {
			degree: humanize.oxford(objects.degree.map(s => s.title).toArray()),
			major: humanize.oxford(objects.major.map(s => s.title).toArray()),
			concentration: humanize.oxford(objects.concentration.map(s => s.title).toArray()),
			emphasis: humanize.oxford(objects.emphasis.map(s => s.title).toArray()),
		}

		let words = {
			degree: humanize.pluralize(objects.degree.size, 'degree'),
			major: humanize.pluralize(objects.major.size, 'major'),
			concentration: humanize.pluralize(objects.concentration.size, 'concentration'),
			emphasis: humanize.pluralize(objects.emphasis.size, 'emphasis', 'emphases'),
		}

		let canGraduate = this.props.graduatability

		let phrases = {
			degree: React.createElement('span', {className: 'area-of-study-list', key:'degree'}, titles.degree),
			major: React.createElement('span', {className: 'area-of-study-list', key:'major'}, titles.major),
			concentration: React.createElement('span', {className: 'area-of-study-list', key:'concentration'}, titles.concentration),
			emphasis: React.createElement('span', {className: 'area-of-study-list', key:'emphasis'}, titles.emphasis),
		}

		let degreeEmphasizer = has.degree === 1 ? 'a ' : ''
		let majorEmphasizer = has.major === 1 ? 'a ' : ''
		let concentrationEmphasizer = has.concentration === 1 ? 'a ' : ''
		let emphasisEmphasizer = has.emphasis === 1 ? 'an ' : ''

		return React.createElement('article', {id: 'student-summary', className: canGraduate ? 'can-graduate' : 'cannot-graduate'},
			React.createElement('div', {key: 'letter', id: 'student-letter'}, name.length ? name[0] : ''),
			React.createElement('p', {key: 'hi'}, 'Hi, ', nameEl, '!'),
			React.createElement('p', {key: 'overview'},
				'You are planning on ', degreeEmphasizer,
				phrases.degree, ' ', words.degree, ', with ', majorEmphasizer, words.major, ' in ', phrases.major,
				(has.concentration > 0) ? [', and ' + concentrationEmphasizer, words.concentration, ' in ', phrases.concentration] : '',
				(has.emphasis > 0) ? [', not to mention ', emphasisEmphasizer, words.emphasis, ' in ', phrases.emphasis] : '',
				'.'),
			React.createElement('p', {key: 'message', className: 'graduation-message'},
				canGraduate ? goodGraduationMessage : badGraduationMessage)
		)
	},
})

export default StudentSummary
