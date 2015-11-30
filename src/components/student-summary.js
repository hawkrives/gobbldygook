import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {oxford} from 'humanize-plus'
import plur from 'plur'
import filter from 'lodash/collection/filter'
import pluck from 'lodash/collection/pluck'
import sample from 'lodash/collection/sample'

import AvatarLetter from './avatar-letter'
import ContentEditable from './content-editable'

import countCredits from '../area-tools/count-credits'

import './student-summary.scss'

const goodGraduationMessage = "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage = "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

const welcomeMessages = [
	'Hi, ',
	'Hi there, ',
	'Hello, ',
	'こんにちは、', // japanese
	'ようこそ、', // japanese
	'Fram! Fram! ',
	'Salut, ',
	'Aloha, ',
	'Привет, ',
	'Вітаю, ',
	'Sawubona, ',
	'Hei, ',
	'Hola, ', // spanish
	'Bonjour, ', // french
	'Hallo, ', // german
	'nyob zoo ', // hmong
	'你好，', // mandarin
	'안녕하세요 ', // korean
	'สวัสดี ', // thai
	'halo, ', // indonesian
]

export default class StudentSummary extends Component {
	static propTypes = {
		actions: PropTypes.object,
		courses: PropTypes.arrayOf(PropTypes.object),
		graduatability: PropTypes.bool.isRequired,
		student: PropTypes.object.isRequired,
	}

	constructor() {
		super()
		this.state = {
			welcome: sample(welcomeMessages),
		}
	}

	render() {
		const {actions} = this.props
		const canGraduate = this.props.graduatability
		const student = this.props.student
		const studies = student.studies

		const NameEl = (
			<ContentEditable
				className='autosize-input'
				onBlur={ev => actions.changeName(student.id, ev.target.value)}
				value={String(student.name)}
			/>
		)

		const degrees = filter(studies, {type: 'degree'})
		const majors = filter(studies, {type: 'major'})
		const concentrations = filter(studies, {type: 'concentration'})
		const emphases = filter(studies, {type: 'emphasis'})

		const degreeWord = plur('degree', degrees.size)
		const majorWord = plur('major', majors.size)
		const concentrationWord = plur('concentration', concentrations.size)
		const emphasisWord = plur('emphasis', emphases.size)

		const degreeEmphasizer = (degrees.size === 1) ? 'a ' : ''
		const majorEmphasizer = (majors.size === 1) ? 'a ' : ''
		const concentrationEmphasizer = (concentrations.size === 1) ? 'a ' : ''
		const emphasisEmphasizer = (emphases.size === 1) ? 'an ' : ''

		const degreeList = oxford(pluck(degrees, 'name'))
		const majorList = oxford(pluck(majors, 'name'))
		const concentrationList = oxford(pluck(concentrations, 'name'))
		const emphasisList = oxford(pluck(emphases, 'name'))

		const currentCredits = countCredits(this.props.courses)
		const neededCredits = student.creditsNeeded
		const enoughCredits = currentCredits >= neededCredits

		const graduationEl = (
			<ContentEditable
				className='autosize-input'
				onBlur={ev => actions.changeGraduation(student.id, parseInt(ev.target.value || 0))}
				value={String(student.graduation)}
			/>
		)

		const matriculationEl = (
			<ContentEditable
				className='autosize-input'
				onBlur={ev => actions.changeMatriculation(student.id, parseInt(ev.target.value || 0))}
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
						{(majors.size || concentrations.size || emphases.size) ? (majors.size) && (concentrations.size || emphases.size) ? ', ' : ' and ' : ''}
						{(majors.size > 0) && `${majorEmphasizer}${majorWord} in ${majorList}`}
						{(majors.size && concentrations.size) ? ', and ' : ''}
						{(concentrations.size > 0) && `${concentrationEmphasizer}${concentrationWord} in ${concentrationList}`}
						{((majors.size || concentrations.size) && emphases.size) ? ', ' : ''}
						{(emphases.size > 0) && `not to mention ${emphasisEmphasizer}${emphasisWord} in ${emphasisList}`}
						{'. '}
						{currentCredits && `You have currently planned for ${currentCredits} of your ${neededCredits} required credits. ${enoughCredits ? 'Good job!' : ''}`}
					</div>
					<div className='paragraph graduation-message'>
						{canGraduate ? goodGraduationMessage : badGraduationMessage}
					</div>
				</div>
			</article>
		)
	}
}
