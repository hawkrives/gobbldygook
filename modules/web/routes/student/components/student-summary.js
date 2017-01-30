// @flow
import React from 'react'
import cx from 'classnames'
import oxford from 'listify'
import plur from 'plur'
import filter from 'lodash/filter'
import map from 'lodash/map'
import sample from 'lodash/sample'

import AvatarLetter from 'modules/web/components/avatar-letter'
import ContentEditable from 'modules/web/components/content-editable'

import { getActiveStudentCourses } from 'modules/web/helpers/get-active-student-courses'
import { countCredits } from 'modules/core/examine-student'

import * as colors from 'modules/web/styles/colors'
import * as variables from 'modules/web/styles/variables'
import * as mixins from 'modules/web/styles/mixins'

const goodGraduationMessage =
	`It looks like you'll make it! Just follow the plan, and go over my output
	with your advisor a few times.`.split('\n').join(' ')

const badGraduationMessage =
	`You haven't planned everything out yet. Ask your advisor if you need help
	fitting everything in.`.split('\n').join(' ')

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

export default function StudentSummary({
	student,
	showMessage=true,
	showAvatar=true,
	randomizeHello=false,
	onChangeName,
	onChangeGraduation,
	onChangeMatriculation,
}: {
	student: Object,
	showMessage?: boolean,
	showAvatar?: boolean,
	randomizeHello?: boolean,
	onChangeName?: (value: string) => any,
	onChangeGraduation?: (value: string) => any,
	onChangeMatriculation?: (value: string) => any,
}) {
	const { studies, canGraduate } = student

	const NameEl = (onChangeName
		? <ContentEditable
			className="autosize-input"
			onBlur={onChangeName}
			value={String(student.name)}
		/>
		: <span>{String(student.name)}</span>)

	const degrees = filter(studies, { type: 'degree' })
	const majors = filter(studies, { type: 'major' })
	const concentrations = filter(studies, { type: 'concentration' })
	const emphases = filter(studies, { type: 'emphasis' })

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

	const graduationEl = (onChangeGraduation
		? <ContentEditable
			className="autosize-input"
			onBlur={onChangeGraduation}
			value={String(student.graduation)}
		/>
		: <span>{String(student.graduation)}</span>
	)

	const matriculationEl = (onChangeMatriculation
		? <ContentEditable
			className="autosize-input"
			onBlur={onChangeMatriculation}
			value={String(student.matriculation)}
		/>
		: <span>{String(student.matriculation)}</span>
	)

	const canGraduateClass = canGraduate ? 'can-graduate' : 'cannot-graduate'

	return (
		<article className={cx('student-summary', canGraduateClass)}>
			<header>
				{showAvatar ? <AvatarLetter
					className={cx('student-letter', canGraduateClass)}
					value={student.name}
				/> : null}
				<div className="intro">
					{randomizeHello ? sample(welcomeMessages) : welcomeMessage}{NameEl}!
				</div>
			</header>
			<div className="content">
				<p>
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
				</p>
				{showMessage ? <p className="graduation-message">
					{canGraduate ? goodGraduationMessage : badGraduationMessage}
				</p>: null}
			</div>
			<style jsx>{`
				.student-summary {
					${mixins.card}

					text-align: center;
					hyphens: auto;
					font-feature-settings: 'onum', 'tnum';
					text-shadow: 0 1px ${colors.white_transparent_50};
				}

				.student-summary.cannot-graduate .graduation-message {
					color: ${colors.deep_orange_500};
				}

				.student-summary.can-graduate .graduation-message {
					color: ${colors.light_green_800};
				}
				.student-summary.can-graduate {
					background-color: ${colors.light_green_50};
				}
				.student-summary.can-graduate::selection {
					background-color: ${colors.light_green_900};
				}

				.content {
					padding: calc(${variables.block_edge_padding} * 2);
				}

				.content p {
					margin: 0;
				}

				.content p + p {
					margin-top: calc(${variables.block_edge_padding} * 2);
				}

				header {
					color: ${colors.black};

					margin: calc(${variables.block_edge_padding} * 2);
					margin-bottom: 0;
					font-style: italic;
					line-height: 1.6em;
				}

				:global(.autosize-input) {
					border-bottom: 1px solid ${colors.gray_400};
					padding: 0 0.125em 0 0;
				}

				:global(.autosize-input):focus {
					outline: 0;
					background-color: ${colors.blue_50};
					border-color: ${colors.blue_500};
				}

				.student-letter {
					display: block;
					margin: ${variables.block_edge_padding} auto calc(${variables.block_edge_padding} * 2);

					border: solid 1px;
					background-color: ${colors.white};
				}

				.student-letter.cannot-graduate {
					color: ${colors.deep_orange_500};
				}

				.student-letter.can-graduate {
					color: ${colors.light_green_800};
					box-shadow:
						0 0 0 5px ${colors.white},
						0 0 0 6px ${colors.light_green_100};
				}
			`}</style>
		</article>
	)
}
