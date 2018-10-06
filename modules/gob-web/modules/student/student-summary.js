// @flow

import React from 'react'
import cx from 'classnames'
import listify from 'listify'
import sample from 'lodash/sample'
import {List} from 'immutable'
import {connect} from 'react-redux'
import {Card} from '../../components/card'
import {AvatarLetter} from '../../components/avatar-letter'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'
import {Student, type AreaQuery} from '@gob/object-student'
import {checkStudentAgainstArea} from '../../workers/check-student'
import {loadArea} from '../../helpers/load-area'
import uniqueId from 'lodash/uniqueId'

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
		this.checkGraduatability(this.props)
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.student !== this.props.student) {
			this.checkGraduatability(this.props)
		}
	}

	checkGraduatability = async (props: Props) => {
		let {student} = props

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
				<ConnectedEditor student={student} />

				{showAvatar && (
					<AvatarLetter
						className={cx(
							'student-letter',
							canGraduate ? 'can-graduate' : 'cannot-graduate',
						)}
						value={student.name}
					/>
				)}

				<Header
					key={student.name}
					canGraduate={canGraduate}
					name={student.name}
					helloMessage={message}
					showAvatar={showAvatar}
				/>

				<DateSummary
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

export {StudentSummary}

type EditorProps = {
	student: Student,
	changeStudent: ChangeStudentFunc,
}

type EditorState = {
	name: string,
	matriculation: string,
	graduation: string,
}

class Editor extends React.Component<EditorProps, EditorState> {
	state = {
		name: this.props.student.name,
		matriculation: String(this.props.student.matriculation),
		graduation: String(this.props.student.graduation),
	}

	nameLabelId = `student-editor--${uniqueId()}`
	matriculationLabelId = `student-editor--${uniqueId()}`
	graduationLabelId = `student-editor--${uniqueId()}`

	changeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
		let val = event.currentTarget.value
		this.setState(() => ({name: val}))
	}

	changeGraduation = (event: SyntheticInputEvent<HTMLInputElement>) => {
		let val = event.currentTarget.value
		this.setState(() => ({graduation: val}))
	}

	changeMatriculation = (event: SyntheticInputEvent<HTMLInputElement>) => {
		let val = event.currentTarget.value
		this.setState(() => ({matriculation: val}))
	}

	onSubmit = (event: SyntheticInputEvent<HTMLFormElement>) => {
		event.preventDefault()

		let {name, matriculation, graduation} = this.state
		let s = this.props.student

		if (matriculation !== s.matriculation) {
			s = s.setMatriculation(matriculation)
		}

		if (graduation !== s.graduation) {
			s = s.setGraduation(graduation)
		}

		if (name !== s.name) {
			s = s.setName(name)
		}

		if (s !== this.props.student) {
			this.props.changeStudent(s)
		}
	}

	render() {
		return (
			<form onSubmit={this.onSubmit} className="student-summary--editor">
				<label htmlFor={this.nameLabelId}>Name:</label>
				<input
					id={this.nameLabelId}
					onChange={this.changeName}
					onBlur={this.onSubmit}
					value={this.state.name}
				/>

				<label htmlFor={this.matriculationLabelId}>
					Matriculation:
				</label>
				<input
					id={this.matriculationLabelId}
					onChange={this.changeMatriculation}
					onBlur={this.onSubmit}
					value={this.state.matriculation}
				/>

				<label htmlFor={this.graduationLabelId}>Graduation:</label>
				<input
					id={this.graduationLabelId}
					onChange={this.changeGraduation}
					onBlur={this.onSubmit}
					value={this.state.graduation}
				/>
			</form>
		)
	}
}

const ConnectedEditor = connect(
	undefined,
	{changeStudent},
)(Editor)

type HeaderProps = {
	canGraduate: boolean,
	helloMessage: string,
	name: string,
	onChangeName?: string => any,
	showAvatar: boolean,
}

export class Header extends React.Component<HeaderProps> {
	handleNameChange = (val: string) => {
		console.log(val)
		this.props.onChangeName && this.props.onChangeName(val)
	}

	render() {
		const props = this.props

		return (
			<header className="student-summary--header">
				{props.helloMessage}
				{String(this.props.name)}!
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
	matriculation: number,
	graduation: number,
}

export class DateSummary extends React.Component<DateSummaryProps> {
	render() {
		const props = this.props

		return (
			<p className="paragraph">
				After matriculating in {String(props.matriculation)}, you are
				planning to graduate in {String(props.graduation)}.
			</p>
		)
	}
}

type DegreeSummaryProps = {
	studies: List<AreaQuery>,
}

export class DegreeSummary extends React.Component<DegreeSummaryProps> {
	render() {
		const grouped: {
			[key: string]: List<{type: string, name: string, revision: string}>,
		} = this.props.studies.groupBy(s => s.type).toJSON()

		const {
			degree: dS = List(),
			major: mS = List(),
			concentration: cS = List(),
			emphasis: eS = List(),
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
		let anyCredits = neededCredits > 0

		return (
			<p className="paragraph">
				You have currently planned for {currentCredits} of your{' '}
				{neededCredits} required credits.
				{anyCredits && enoughCredits ? ' Good job!' : ''}
			</p>
		)
	}
}
