import React, {PropTypes} from 'react'
import cx from 'classnames'
import {oxford} from 'humanize-plus'
import plur from 'plur'
import filter from 'lodash/collection/filter'
import map from 'lodash/collection/map'
import sample from 'lodash/collection/sample'

import AvatarLetter from '../../../components/avatar-letter'
import ContentEditable from '../../../components/content-editable'

import getActiveStudentCourses from '../../../helpers/get-active-student-courses'
import countCredits from '../../../area-tools/count-credits'

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

const welcomeMessage = sample(welcomeMessages)

export default function StudentSummary(props) {
	const {student} = props
	const {studies, canGraduate} = student

	const NameEl = (
		<ContentEditable
			className='autosize-input'
			onBlur={props.onChangeName}
			value={String(student.name)}
		/>
	)

	const degrees = filter(studies, {type: 'degree'})
	const majors = filter(studies, {type: 'major'})
	const concentrations = filter(studies, {type: 'concentration'})
	const emphases = filter(studies, {type: 'emphasis'})

	const degreeWord = plur('degree', degrees.length)
	const majorWord = plur('major', majors.length)
	const concentrationWord = plur('concentration', concentrations.length)
	const emphasisWord = plur('emphasis', emphases.length)

	const degreeEmphasizer = (degrees.length === 1) ? 'a ' : ''
	const majorEmphasizer = (majors.length === 1) ? 'a ' : ''
	const concentrationEmphasizer = (concentrations.length === 1) ? 'a ' : ''
	const emphasisEmphasizer = (emphases.length === 1) ? 'an ' : ''

	const degreeList = oxford(map(degrees, d => d.name))
	const majorList = oxford(map(majors, m => m.name))
	const concentrationList = oxford(map(concentrations, c => c.name))
	const emphasisList = oxford(map(emphases, e => e.name))

	const currentCredits = countCredits(getActiveStudentCourses(student))
	const neededCredits = student.creditsNeeded
	const enoughCredits = currentCredits >= neededCredits

	const graduationEl = (
		<ContentEditable
			className='autosize-input'
			onBlur={props.onChangeGraduation}
			value={String(student.graduation)}
		/>
	)

	const matriculationEl = (
		<ContentEditable
			className='autosize-input'
			onBlur={props.onChangeMatriculation}
			value={String(student.matriculation)}
		/>
	)

	const canGraduateClass = canGraduate ? 'can-graduate' : 'cannot-graduate'

	return (
		<article className={cx('student-summary', canGraduateClass)}>
			<header className='student-summary--header'>
				<AvatarLetter
					className={cx('student-letter', canGraduateClass)}
					value={student.name}
				/>
				<div className='intro'>{welcomeMessage}{NameEl}!</div>
			</header>
			<div className='content'>
				<div className='paragraph'>
					After matriculating in {matriculationEl}, you are planning to graduate in {graduationEl}, with {' '}
					{(degrees.length > 0) ? `${degreeEmphasizer}${degreeList} ${degreeWord}` : `no ${degreeWord}`}
					{(majors.length || concentrations.length || emphases.length) ? (majors.length) && (concentrations.length || emphases.length) ? ', ' : ' and ' : ''}
					{(majors.length > 0) && `${majorEmphasizer}${majorWord} in ${majorList}`}
					{(majors.length && concentrations.length) ? ', and ' : ''}
					{(concentrations.length > 0) && `${concentrationEmphasizer}${concentrationWord} in ${concentrationList}`}
					{((majors.length || concentrations.length) && emphases.length) ? ', ' : ''}
					{(emphases.length > 0) && `not to mention ${emphasisEmphasizer}${emphasisWord} in ${emphasisList}`}
					{'. '}
					{currentCredits ? `You have currently planned for ${currentCredits} of your ${neededCredits} required credits. ${enoughCredits ? 'Good job!' : ''}`: ''}
				</div>
				<div className='paragraph graduation-message'>
					{canGraduate ? goodGraduationMessage : badGraduationMessage}
				</div>
			</div>
		</article>
	)
}

StudentSummary.propTypes = {
	onChangeGraduation: PropTypes.func.isRequired,
	onChangeMatriculation: PropTypes.func.isRequired,
	onChangeName: PropTypes.func.isRequired,
	student: PropTypes.object.isRequired,
}
