import _ from 'lodash'
import React from 'react'
import {oxford, pluralize} from 'humanize-plus'

import ContentEditable from './contentEditable'

import studentActions from '../flux/studentActions'

let goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
let badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

class StudentSummary extends React.Component {
	constructor(props) {
		super(props)
		this.updateStudentName = this.updateStudentName.bind(this)
	}

	updateStudentName(ev) {
		let newName = ev.target.value
		newName = newName.trim()
		studentActions.changeName(this.props.student.id, newName)
	}

	render() {
		let canGraduate = this.props.graduatability
		let student = this.props.student
		let studies = student.studies

		let name = student.name
		let NameEl = <ContentEditable content={name} onChange={this.updateStudentName} />

		let has = studies
			.groupBy(s => s.type)
			.map(s => s.size)
			.toObject()

		let degrees = studies.filter(s => s.type === 'degree')
		let majors = studies.filter(s => s.type === 'major')
		let concentrations = studies.filter(s => s.type === 'concentration')
		let emphases = studies.filter(s => s.type === 'emphasis')

		let degreeTitles = oxford(degrees.map(s => s.title).toArray())
		let majorTitles = oxford(majors.map(s => s.title).toArray())
		let concentrationTitles = oxford(concentrations.map(s => s.title).toArray())
		let emphasisTitles = oxford(emphases.map(s => s.title).toArray())

		let degreeWords = pluralize(degrees.size, 'degree')
		let majorWords = pluralize(majors.size, 'major')
		let concentrationWords = pluralize(concentrations.size, 'concentration')
		let emphasisWords = pluralize(emphases.size, 'emphasis', 'emphases')

		let degreeEmphasizer = has.degree === 1 ? 'a ' : ''
		let majorEmphasizer = has.major === 1 ? 'a ' : ''
		let concentrationEmphasizer = has.concentration === 1 ? 'a ' : ''
		let emphasisEmphasizer = has.emphasis === 1 ? 'an ' : ''

		let degreeEl = <span className='area-of-study-list' key='degrees'>{degreeTitles}</span>
		let majorEl = <span className='area-of-study-list' key='majors'>{majorTitles}</span>
		let concentrationEl = <span className='area-of-study-list' key='concentrations'>{concentrationTitles}</span>
		let emphasisEl = <span className='area-of-study-list' key='emphases'>{emphasisTitles}</span>

		return <article id='student-summary' className={canGraduate ? 'can-graduate' : 'cannot-graduate'}>
			<header>
				<div id='student-letter'>{name.length ? name[0] : ''}</div>
				<p>Hi, {NameEl}</p>
			</header>
			<div className='content'>
				<p>
					You are planning on {degreeEmphasizer} {degreeEl} {degreeWords}
					{(has.major > 0) ? [', with ', majorEmphasizer, majorWords, ' in ', majorEl] : null}
					{(has.concentration > 0) ? [', and ' + concentrationEmphasizer, concentrationWords, ' in ', concentrationEl] : null}
					{(has.emphasis > 0) ? [', not to mention ', emphasisEmphasizer, emphasisWords, ' in ', emphasisEl] : null}.
				</p>
				<p className='graduation-message'>
					{canGraduate ? goodGraduationMessage : badGraduationMessage}
				</p>
			</div>
		</article>
	}
}

StudentSummary.propTypes = {
	student: React.PropTypes.object.isRequired,
	graduatability: React.PropTypes.bool.isRequired,
}

export default StudentSummary
