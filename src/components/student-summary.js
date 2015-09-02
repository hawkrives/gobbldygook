import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import cx from 'classnames'
import {oxford} from 'humanize-plus'
import plur from 'plur'
import sample from 'lodash/collection/sample'

import AvatarLetter from './avatar-letter'
import ContentEditable from './content-editable'

import studentActions from '../flux/student-actions'
import Student from '../models/student'

import countCredits from '../lib/count-credits'

import './student-summary.scss'

const goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

const welcomeMessages = [
	'Hi, ',
	'Hi there, ',
	'Hello, ',
	'Konnichiha, ',
	'こんにちは、',
	'Yōkouso, ',
	'ようこそ、',
	'Fram! Fram! ',
	'Salut, ',
	'Aloha, ',
	'Привет, ',
	'Вітаю, ',
	'Sawubona, ',
	'Hei, ',
]

export default class StudentSummary extends Component {
	static propTypes = {
		courses: PropTypes.instanceOf(Immutable.List),
		coursesLoaded: PropTypes.bool.isRequired,
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

		const NameEl = (
			<ContentEditable
				className='autosize-input'
				onBlur={ev => studentActions.changeName(student.id, ev.target.value)}
				value={String(student.name)}
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

		const degreeEmphasizer = (degrees.size === 1) ? 'a ' : ''
		const majorEmphasizer = (majors.size === 1) ? 'a ' : ''
		const concentrationEmphasizer = (concentrations.size === 1) ? 'a ' : ''
		const emphasisEmphasizer = (emphases.size === 1) ? 'an ' : ''

		const degreeList = oxford(degrees.map(s => s.name).toArray())
		const majorList = oxford(majors.map(s => s.name).toArray())
		const concentrationList = oxford(concentrations.map(s => s.name).toArray())
		const emphasisList = oxford(emphases.map(s => s.name).toArray())

		const currentCredits = countCredits(this.props.courses)
		const neededCredits = student.creditsNeeded
		const enoughCredits = currentCredits >= neededCredits

		const graduationEl = (
			<ContentEditable
				className='autosize-input'
				onBlur={ev => studentActions.changeGraduation(student.id, parseInt(ev.target.value || 0))}
				value={String(student.graduation)}
			/>
		)

		const matriculationEl = (
			<ContentEditable
				className='autosize-input'
				onBlur={ev => studentActions.changeMatriculation(student.id, parseInt(ev.target.value || 0))}
				value={String(student.matriculation)}
			/>
		)

		return (
			<article className={cx('student-summary', canGraduate ? 'can-graduate' : 'cannot-graduate')}>
				<header className='student-summary--header'>
					<AvatarLetter
						className={cx(
							'student-letter',
							this.props.graduatability
								? 'can-graduate'
								: 'cannot-graduate'
						)}
						value={student.name}
					/>
					<div className='intro'>{this.state.welcome}{NameEl}!</div>
				</header>
				<div className='content'>
					<div className='paragraph'>
						After matriculating in {matriculationEl}, you are planning to graduate in {graduationEl}, with {' '}
						{(degrees.size > 0) ? `${degreeEmphasizer}${degreeList} ${degreeWord}` : `no ${degreeWord}`}
						{(majors.size) && (concentrations.size || emphases.size) ? ', ' : ' and '}
						{(majors.size > 0) && `${majorEmphasizer}${majorWord} in ${majorList}`}
						{(majors.size && concentrations.size) ? ', and ' : ''}
						{(concentrations.size > 0) && `${concentrationEmphasizer}${concentrationWord} in ${concentrationList}`}
						{((majors.size || concentrations.size) && emphases.size) ? ', ' : ''}
						{(emphases.size > 0) && `not to mention ${emphasisEmphasizer}${emphasisWord} in ${emphasisList}`}
						{'. '}
						{this.props.coursesLoaded && `You have currently planned for ${currentCredits} of your ${neededCredits} required credits. ${enoughCredits ? '👍' : ''}`}
					</div>
					<div className='paragraph graduation-message'>
						{canGraduate ? goodGraduationMessage : badGraduationMessage}
					</div>
				</div>
			</article>
		)
	}
}
