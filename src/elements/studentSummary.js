import React from 'react'
import Immutable from 'immutable'
import {oxford} from 'humanize-plus'
import plur from 'plur'

import AutosizeInput from 'react-input-autosize'

import studentActions from '../flux/studentActions'

const goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

export default class StudentSummary extends React.Component {
	static propTypes = {
		graduatability: React.PropTypes.bool.isRequired,
		student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
	}

	render() {
		// console.log('StudentSummary#render')
		const canGraduate = this.props.graduatability
		const student = this.props.student
		const studies = student.studies

		const name = student.name
		const studentId = student.id
		const NameEl = (<AutosizeInput className='autosize-input'
			value={name}
			onChange={ev => studentActions.updateName(studentId, ev.target.value.trim())} />)

		const has = studies
			.groupBy(s => s.type)
			.map(s => s.size)
			.toObject()

		const degrees = studies.filter(s => s.type === 'degree')
		const majors = studies.filter(s => s.type === 'major')
		const concentrations = studies.filter(s => s.type === 'concentration')
		const emphases = studies.filter(s => s.type === 'emphasis')

		const degreeWord = plur('degree', degrees.size)
		const majorWord = plur('major', majors.size)
		const concentrationWord = plur('concentration', concentrations.size)
		const emphasisWord = plur('emphasis', 'emphases', emphases.size)

		const degreeEmphasizer = has.degree === 1 ? 'a ' : ''
		const majorEmphasizer = has.major === 1 ? 'a ' : ''
		const concentrationEmphasizer = has.concentration === 1 ? 'a ' : ''
		const emphasisEmphasizer = has.emphasis === 1 ? 'an ' : ''

		const degreeEl = <span className='area-of-study-list'>{oxford(degrees.map(s => s.name).toArray())}</span>
		const majorEl = <span className='area-of-study-list'>{oxford(majors.map(s => s.name).toArray())}</span>
		const concentrationEl = <span className='area-of-study-list'>{oxford(concentrations.map(s => s.name).toArray())}</span>
		const emphasisEl = <span className='area-of-study-list'>{oxford(emphases.map(s => s.name).toArray())}</span>

		const graduationEl = (<AutosizeInput
			className='autosize-input'
			value={String(student.graduation)}
			onChange={ev => studentActions.changeGraduation(studentId, parseInt(ev.target.value))} />)

		const sinceMatriculationEl = (<AutosizeInput
			className='autosize-input'
			value={String(student.graduation - student.matriculation)}
			onChange={ev => studentActions.changeMatriculation(studentId, student.graduation - parseInt(ev.target.value))} />)

		return (<article id='student-summary' className={canGraduate ? 'can-graduate' : 'cannot-graduate'}>
			<header>
				<div id='student-letter'>{name.length ? name[0] : ''}</div>
				<p>Hi, {NameEl}</p>
			</header>
			<div className='content'>
				<p>
					You are planning on graduating in {graduationEl}, {sinceMatriculationEl}{" "}
					years after matriculating, with {degreeEmphasizer} {degreeEl} {degreeWord}
					{(has.major > 0) ? [', ', majorEmphasizer, majorWord, ' in ', majorEl] : null}
					{(has.concentration > 0) ? [', and ' + concentrationEmphasizer, concentrationWord, ' in ', concentrationEl] : null}
					{(has.emphasis > 0) ? [', not to mention ', emphasisEmphasizer, emphasisWord, ' in ', emphasisEl] : null}.
				</p>
				<p className='graduation-message'>
					{canGraduate ? goodGraduationMessage : badGraduationMessage}
				</p>
			</div>
		</article>)
	}
}
