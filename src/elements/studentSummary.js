import React from 'react'
import Immutable from 'immutable'
import {oxford, pluralize} from 'humanize-plus'

import AutosizeInput from 'react-input-autosize'

import studentActions from '../flux/studentActions'

const goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

class StudentSummary extends React.Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.student !== this.props.student || nextProps.graduatability !== this.props.graduatability
	}

	render() {
		// console.log('StudentSummary#render')
		let canGraduate = this.props.graduatability
		let student = this.props.student
		let studies = student.studies

		let name = student.name
		let studentId = this.props.student.id
		let NameEl = <AutosizeInput className='autosize-input'
			value={name}
			onChange={(ev) => studentActions.updateName(studentId, ev.target.value.trim())} />

		let has = studies
			.groupBy(s => s.type)
			.map(s => s.size)
			.toObject()

		let degrees = studies.filter(s => s.type === 'degree')
		let majors = studies.filter(s => s.type === 'major')
		let concentrations = studies.filter(s => s.type === 'concentration')
		let emphases = studies.filter(s => s.type === 'emphasis')

		let degreeTitles = oxford(degrees.map(s => s.name).toArray())
		let majorTitles = oxford(majors.map(s => s.name).toArray())
		let concentrationTitles = oxford(concentrations.map(s => s.name).toArray())
		let emphasisTitles = oxford(emphases.map(s => s.name).toArray())

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

		// console.log(student.graduation, student.matriculation)

		const graduationEl = <AutosizeInput
			className='autosize-input'
			value={String(student.graduation)}
			onChange={ev => studentActions.changeGraduation(studentId, parseInt(ev.target.value))} />

		const sinceMatriculationEl = <AutosizeInput
			className='autosize-input'
			value={String(student.graduation - student.matriculation)}
			onChange={ev => studentActions.changeMatriculation(studentId, student.graduation - parseInt(ev.target.value))} />

		return <article id='student-summary' className={canGraduate ? 'can-graduate' : 'cannot-graduate'}>
			<header>
				<div id='student-letter'>{name.length ? name[0] : ''}</div>
				<p>Hi, {NameEl}</p>
			</header>
			<div className='content'>
				<p>
					You are planning on graduating in {graduationEl}, {sinceMatriculationEl}{" "}
					years after matriculating, with {degreeEmphasizer} {degreeEl} {degreeWords}
					{(has.major > 0) ? [', ', majorEmphasizer, majorWords, ' in ', majorEl] : null}
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
	student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
	graduatability: React.PropTypes.bool.isRequired,
}

export default StudentSummary
