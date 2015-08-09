import React, {Component, PropTypes} from 'react'
import {oxford} from 'humanize-plus'
import plur from 'plur'
import sample from 'lodash/collection/sample'

import AutosizeInput from 'react-input-autosize'
import ContentEditable from './content-editable'

import studentActions from '../flux/student-actions'
import Student from '../models/student'

const goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

const welcomeMessages = [
	'Hi, ',
	'Hello, ',
	'Konnichiwa, ',
	'こんにちは、',
]

export default class StudentSummary extends Component {
	static propTypes = {
		graduatability: PropTypes.bool.isRequired,
		student: PropTypes.instanceOf(Student).isRequired,
	}

	constructor() {
		super()
		this.state = {
			welcome: sample(welcomeMessages),
		}
	}

	render() {
		const canGraduate = this.props.graduatability
		const student = this.props.student
		const studies = student.studies

		const name = student.name
		const studentId = student.id
		const NameEl = (
			<ContentEditable className='autosize-input'
				value={String(student.name)}
				onChange={ev => studentActions.changeName(student.id, ev.target.value)}
			/>
		)

		const degrees = studies.filter(s => s.type === 'degree')
		const majors = studies.filter(s => s.type === 'major')
		const concentrations = studies.filter(s => s.type === 'concentration')
		const emphases = studies.filter(s => s.type === 'emphasis')

		const degreeWord = plur('degree', degrees.size)
		const majorWord = plur('major', majors.size)
		const concentrationWord = plur('concentration', concentrations.size)
		const emphasisWord = plur('emphasis', 'emphases', emphases.size)

		const degreeEmphasizer = degrees.size === 1 ? 'a ' : ''
		const majorEmphasizer = majors.size === 1 ? 'a ' : ''
		const concentrationEmphasizer = concentrations.size === 1 ? 'a ' : ''
		const emphasisEmphasizer = emphases.size === 1 ? 'an ' : ''

		const degreeEl = oxford(degrees.map(s => s.name).toArray())
		const majorEl = oxford(majors.map(s => s.name).toArray())
		const concentrationEl = oxford(concentrations.map(s => s.name).toArray())
		const emphasisEl = oxford(emphases.map(s => s.name).toArray())

		const graduationEl = (
			<ContentEditable
				className='autosize-input'
				value={String(student.graduation)}
				onChange={ev => studentActions.changeGraduation(student.id, parseInt(ev.target.value || 0))} />
		)

		const matriculationEl = (
			<ContentEditable
				className='autosize-input'
				value={String(student.matriculation)}
				onChange={ev => studentActions.changeMatriculation(student.id, parseInt(ev.target.value || 0))} />
		)

		return (
			<article id='student-summary' className={canGraduate ? 'can-graduate' : 'cannot-graduate'}>
				<header>
					<div id='student-letter'>{name.length ? name[0] : ''}</div>
					<div className='paragraph'>{this.state.welcome}{NameEl}!</div>
				</header>
				<div className='content'>
					<div className='paragraph'>
						After matriculating in {matriculationEl}, you are planning to graduate in {graduationEl}, with {' '}
						{(degrees.size > 0) ? `${degreeEmphasizer}${degreeEl} ${degreeWord}` : `no ${degreeWord}`}
						{(majors.size) ? (concentrations.size || emphases.size) ? ', ' : ' and ' : ''}
						{(majors.size > 0) ? `${majorEmphasizer}${majorWord} in ${majorEl}` : null}
						{(majors.size && concentrations.size) ? ', and ' : ''}
						{(concentrations.size > 0) ? `${concentrationEmphasizer}${concentrationWord} in ${concentrationEl}` : null}
						{((majors.size || concentrations.size) && emphases.size) ? ', ' : ''}
						{(emphases.size > 0) ? `not to mention ${emphasisEmphasizer}${emphasisWord} in ${emphasisEl}` : null}
						{'.'}
					</div>
					<div className='paragraph graduation-message'>
						{canGraduate ? goodGraduationMessage : badGraduationMessage}
					</div>
				</div>
			</article>
		)
	}
}
