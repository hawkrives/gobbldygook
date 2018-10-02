// @flow
import React from 'react'
import cx from 'classnames'
import listify from 'listify'
import groupBy from 'lodash/groupBy'
import sample from 'lodash/sample'

import {Card} from '../../components/card'
import {AvatarLetter} from '../../components/avatar-letter'
import ContentEditable from '../../components/content-editable'

import type {StudentType, AreaQuery} from '@gob/object-student'

import './student-summary.scss'

const welcomeMessages = [
	'Hi, ',
	'Hi there, ',
	'Hello, ',
	'こんにちは、', // japanese
	'ようこそ、', // japanese
	'Fram! Fram! ',
	'Salut, ',
	'Aloha, ', // hawaiian
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
	'Salve, ', // latin
	'Χαῖρε! ', // ancient greek
]

const welcomeMessage = welcomeMessages[2]

type Props = {
	randomizeHello?: boolean,
	showAvatar?: boolean,
	showMessage?: boolean,
	student: StudentType,
}

type State = {
	message: string,
	canGraduate: boolean,
	creditsNeeded: ?number,
	creditsTaken: ?number,
	checking: boolean,
}

export class StudentSummary extends React.Component<Props, State> {
	state = {
		message: this.props.randomizeHello
			? sample(welcomeMessages)
			: welcomeMessage,
		checking: true,
		canGraduate: false,
		creditsNeeded: null,
		creditsTaken: null,
	}

	componentDidMount() {
		this.checkGraduatability()
	}

	checkGraduatability = async () => {
		let {student} = this.props

		this.setState(() => ({checking: true}))

		let {
			canGraduate,
			creditsNeeded,
			creditsTaken,
		} = await student.checkGraduatability()

		this.setState(() => ({
			checking: false,
			canGraduate,
			creditsNeeded,
			creditsTaken,
		}))
	}

	render() {
		let {student, showMessage = true, showAvatar = true} = this.props

		let {checking, canGraduate, creditsNeeded, creditsTaken} = this.state

		let {studies} = student

		let gradClassName = canGraduate ? 'can-graduate' : 'cannot-graduate'

		let message = this.state.message

		return (
			<Card
				as="article"
				className={cx('student-summary', gradClassName, {checking})}
			>
				<Header
					canGraduate={canGraduate}
					name={student.name}
					onChangeName={student.setName}
					helloMessage={message}
					showAvatar={showAvatar}
				/>

				<DateSummary
					onChangeGraduation={student.setGraduation}
					onChangeMatriculation={student.setMatriculation}
					matriculation={student.matriculation}
					graduation={student.graduation}
				/>

				<DegreeSummary studies={studies} />

				<CreditSummary
					currentCredits={creditsTaken}
					neededCredits={creditsNeeded}
				/>

				{showMessage ? <Footer canGraduate={canGraduate} /> : null}
			</Card>
		)
	}
}

type HeaderProps = {
	canGraduate: boolean,
	helloMessage: string,
	name: string,
	onChangeName?: string => any,
	showAvatar: boolean,
}

export class Header extends React.Component<HeaderProps> {
	render() {
		const props = this.props

		const className = props.canGraduate ? 'can-graduate' : 'cannot-graduate'

		const name = (
			<ContentEditable
				disabled={!props.onChangeName}
				className="autosize-input"
				onBlur={props.onChangeName}
				value={String(props.name)}
			/>
		)

		return (
			<header className="student-summary--header">
				{props.showAvatar && (
					<AvatarLetter
						className={cx('student-letter', className)}
						value={props.name}
					/>
				)}

				<div className="intro">
					{props.helloMessage}
					{name}!
				</div>
			</header>
		)
	}
}

type FooterProps = {
	canGraduate: boolean,
}

const goodGraduationMessage =
	"It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage =
	"You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

export class Footer extends React.Component<FooterProps> {
	render() {
		const msg = this.props.canGraduate
			? goodGraduationMessage
			: badGraduationMessage

		return <p className="paragraph graduation-message">{msg}</p>
	}
}

type DateSummaryProps = {
	onChangeGraduation?: string => any,
	onChangeMatriculation?: string => any,
	matriculation: number,
	graduation: number,
}

export class DateSummary extends React.Component<DateSummaryProps> {
	render() {
		const props = this.props

		const matriculation = (
			<ContentEditable
				disabled={!props.onChangeMatriculation}
				className="autosize-input"
				onBlur={props.onChangeMatriculation}
				value={String(props.matriculation)}
			/>
		)

		const graduation = (
			<ContentEditable
				disabled={!props.onChangeGraduation}
				className="autosize-input"
				onBlur={props.onChangeGraduation}
				value={String(props.graduation)}
			/>
		)

		return (
			<p className="paragraph">
				After matriculating in {matriculation}, you are planning to
				graduate in {graduation}.
			</p>
		)
	}
}

type DegreeSummaryProps = {
	studies: Array<AreaQuery>,
}

export class DegreeSummary extends React.Component<DegreeSummaryProps> {
	render() {
		const grouped: {
			[key: string]: {+type: string, +name: string}[],
		} = groupBy(this.props.studies, s => s.type)

		const {
			degree: dS = [],
			major: mS = [],
			concentration: cS = [],
			emphasis: eS = [],
		} = grouped

		const dCount = dS.length
		const mCount = mS.length
		const cCount = cS.length
		const eCount = eS.length

		const dWord = dCount === 1 ? 'degree' : 'degrees'
		const mWord = mCount === 1 ? 'major' : 'majors'
		const cWord = cCount === 1 ? 'concentration' : 'concentrations'
		const eWord = eCount === 1 ? 'emphasis' : 'emphases'

		const dEmph = dCount === 1 ? 'a ' : ''
		const mEmph = mCount === 1 ? 'a ' : ''
		const cEmph = cCount === 1 ? 'a ' : ''
		const eEmph = eCount === 1 ? 'an ' : ''

		const dList = listify(dS.map(d => d.name))
		const mList = listify(mS.map(m => m.name))
		const cList = listify(cS.map(c => c.name))
		const eList = listify(eS.map(e => e.name))

		return (
			<p className="paragraph">
				You are planning on{' '}
				{dCount > 0 ? `${dEmph}${dList} ${dWord}` : `no ${dWord}`}
				{mCount || cCount || eCount
					? mCount && (cCount || eCount)
						? ', '
						: ' and '
					: ''}
				{mCount ? `${mEmph}${mWord} in ${mList}` : ''}
				{mCount && cCount ? ', and ' : ''}
				{cCount ? `${cEmph}${cWord} in ${cList}` : ''}
				{(mCount || cCount) && eCount ? ', ' : ''}
				{eCount ? `not to mention ${eEmph}${eWord} in ${eList}` : ''}
				{'.'}
			</p>
		)
	}
}

type CreditSummaryProps = {
	currentCredits: ?number,
	neededCredits: ?number,
}

export class CreditSummary extends React.Component<CreditSummaryProps> {
	render() {
		let {currentCredits, neededCredits} = this.props

		if (currentCredits == null) {
			return null
		}

		if (neededCredits == null) {
			return (
				<p className="paragraph">
					You have currently planned for {currentCredits} credits.
				</p>
			)
		}

		let enoughCredits = currentCredits >= neededCredits

		return (
			<p className="paragraph">
				You have currently planned for {currentCredits} of your{' '}
				{neededCredits} required credits.
				{enoughCredits ? ' Good job!' : ''}
			</p>
		)
	}
}
