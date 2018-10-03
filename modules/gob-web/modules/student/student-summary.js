// @flow

import React from 'react'
import cx from 'classnames'
import listify from 'listify'
import sample from 'lodash/sample'
import {Set} from 'immutable'
import {connect} from 'react-redux'
import {Card} from '../../components/card'
import {AvatarLetter} from '../../components/avatar-letter'
import ContentEditable from '../../components/content-editable'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'
import {Student, type AreaQuery} from '@gob/object-student'
import {checkStudentAgainstArea} from '../../workers/check-student'
import {loadArea} from '../../helpers/load-area'

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
	student: Student,
	changeStudent: ChangeStudentFunc,
}

type State = {
	message: string,
	canGraduate: boolean,
	creditsNeeded: ?number,
	creditsTaken: ?number,
	checking: boolean,
}

class StudentSummary extends React.Component<Props, State> {
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

		let areas = student.studies.map(loadArea)
		let loadedAreas = (await Promise.all(areas))
			.filter(({error}) => !error)
			.map(({data}) => data)

		let promises = loadedAreas.map(a => checkStudentAgainstArea(student, a))
		let results = await Promise.all(promises)

		let canGraduate = results.every(r => r.computed === true)
		let {creditsNeeded = 0, creditsTaken = 0} = {}

		this.setState(() => ({
			checking: false,
			canGraduate,
			creditsNeeded,
			creditsTaken,
		}))
	}

	changeName = (val: string) => {
		let s = this.props.student.setName(val)
		this.props.changeStudent(s)
	}
	changeGraduation = (val: string) => {
		let s = this.props.student.setGraduation(val)
		this.props.changeStudent(s)
	}
	changeMatriculation = (val: string) => {
		let s = this.props.student.setMatriculation(val)
		this.props.changeStudent(s)
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
					onChangeName={this.changeName}
					helloMessage={message}
					showAvatar={showAvatar}
				/>

				<DateSummary
					onChangeGraduation={this.changeGraduation}
					onChangeMatriculation={this.changeMatriculation}
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

const connected = connect(
	undefined,
	{changeStudent},
)(StudentSummary)

export {connected as StudentSummary}

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
	studies: Set<AreaQuery>,
}

export class DegreeSummary extends React.Component<DegreeSummaryProps> {
	render() {
		const grouped: {
			[key: string]: Set<{type: string, name: string, revision: string}>,
		} = this.props.studies.groupBy(s => s.type).toJSON()

		const {
			degree: dS = Set(),
			major: mS = Set(),
			concentration: cS = Set(),
			emphasis: eS = Set(),
		} = grouped

		const dCount = dS.size
		const mCount = mS.size
		const cCount = cS.size
		const eCount = eS.size

		const dWord = dCount === 1 ? 'degree' : 'degrees'
		const mWord = mCount === 1 ? 'major' : 'majors'
		const cWord = cCount === 1 ? 'concentration' : 'concentrations'
		const eWord = eCount === 1 ? 'emphasis' : 'emphases'

		const dEmph = dCount === 1 ? 'a ' : ''
		const mEmph = mCount === 1 ? 'a ' : ''
		const cEmph = cCount === 1 ? 'a ' : ''
		const eEmph = eCount === 1 ? 'an ' : ''

		const dList = listify([...dS.map(d => d.name)])
		const mList = listify([...mS.map(m => m.name)])
		const cList = listify([...cS.map(c => c.name)])
		const eList = listify([...eS.map(e => e.name)])

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
