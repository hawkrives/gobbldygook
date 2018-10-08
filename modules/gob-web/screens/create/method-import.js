// @flow

import React from 'react'
import serializeError from 'serialize-error'
import {RaisedButton} from '../../components/button'
import {
	convertStudent,
	semesterName,
	type PartialStudent,
} from '@gob/school-st-olaf-college'
import {Map, List} from 'immutable'
import {getCourse} from '../../helpers/get-courses'
import {StudentSummary} from '../../modules/student/student-summary'
import {
	action as initStudent,
	type ActionCreator as InitStudentFunc,
} from '../../redux/students/actions/init-student'
import {connect} from 'react-redux'
import type {Course as CourseType, Result} from '@gob/types'
import {Student, Schedule} from '@gob/object-student'
import {Header} from './components'
import './method-import.scss'

type Props = {
	+initStudent: InitStudentFunc, // redux
	+navigate?: string => mixed,
}

type State = {
	status: 'pending' | 'processing' | 'ready',
	error: ?Error,
	ids: Array<mixed>,
	selectedId: ?number,
	student: ?Student,
	rawStudentText: string,
	parsedStudentText: ?PartialStudent,
}

class SISImportScreen extends React.Component<Props, State> {
	state = {
		status: 'pending',
		error: null,
		ids: [],
		selectedId: null,
		student: null,
		rawStudentText: '',
		parsedStudentText: null,
	}

	handleImportData = async () => {
		let {parsedStudentText} = this.state
		if (!parsedStudentText) {
			this.setState(() => ({error: new Error('no data to import!')}))
			return
		}

		this.setState(() => ({status: 'processing'}))

		try {
			let student = await convertStudent(parsedStudentText, getCourse)
			this.setState(() => ({student}))
		} catch (error) {
			console.warn(error)
			this.setState(() => ({error: serializeError(error)}))
		}
	}

	handleCreateStudent = () => {
		if (!this.state.student) {
			return
		}
		let id = this.state.student.id
		this.props.initStudent(this.state.student)

		if (!this.props.navigate) {
			throw new Error('no navigate prop passed!')
		}
		this.props.navigate(`/student/${id}`)
	}

	handleRawStudent = (ev: SyntheticInputEvent<HTMLTextAreaElement>) => {
		ev.preventDefault()

		let data = ev.currentTarget.value

		this.setState(() => ({rawStudentText: data}))

		this.setState(
			() => {
				try {
					return {parsedStudentText: JSON.parse(data)}
				} catch (error) {
					console.warn(error)
					return {error}
				}
			},
			() => {
				this.handleImportData()
			},
		)
	}

	render() {
		let {student, error, parsedStudentText} = this.state

		return (
			<>
				<Header>
					<h1>Import from the SIS</h1>
				</Header>

				<p>
					This is a <strong>Work-In-Progress</strong>. It may not work
					at all!
				</p>

				<hr />

				<p>
					To import your student data from St. Olaf's SIS, follow the
					following steps:
				</p>

				<ol>
					<li>
						Open{' '}
						<a
							href="https://www.stolaf.edu/sis/st-courses-json.cfm"
							target="_blank"
							rel="noopener noreferrer"
						>
							stolaf.edu/sis/st-courses-json.cfm
						</a>{' '}
						in a new tab
					</li>
					<li>Copy the text from the text box (all of it)</li>
					<li>Paste the text into the text box below</li>
				</ol>

				<textarea
					style={{width: '100%', height: '100px'}}
					value={this.state.rawStudentText}
					onChange={this.handleRawStudent}
					placeholder="Paste the gibberish here"
				/>

				{parsedStudentText && (
					<details>
						<summary>Parsed student data</summary>
						<pre>{JSON.stringify(parsedStudentText, null, 2)}</pre>
					</details>
				)}

				{error && (
					<details className="error-spot">
						<summary>
							<strong>{error.name}</strong>: {error.message}
						</summary>
						<pre className="error-stack">{error.stack}</pre>
					</details>
				)}

				{student && <StudentInfo student={student} />}

				{student && (
					<RaisedButton onClick={this.handleCreateStudent}>
						Import Student
					</RaisedButton>
				)}
			</>
		)
	}
}

const StudentInfo = ({student}: {student: Student}) => (
	<>
		<StudentSummary
			student={student}
			showEditor={false}
			showMessage={false}
		/>

		<ul>
			{student.schedules
				.sortBy(s => s.getTerm())
				.groupBy(s => s.year)
				.map((schedules, year) => (
					<li key={year}>
						{year}:
						<ScheduleListing
							fabrications={student.fabrications}
							schedules={schedules}
						/>
					</li>
				))
				.toList()
				.toArray()}
		</ul>
	</>
)

const ScheduleListing = (props: {
	schedules: Map<string, Schedule>,
	fabrications: List<CourseType>,
}) => {
	let {schedules = Map(), fabrications = List()} = props

	return (
		<ul>
			{schedules
				.sortBy(s => s.semester)
				.map(schedule => (
					<li key={schedule.semester}>
						{semesterName(schedule.semester)}:
						<AbbreviatedCourseListing
							fabrications={fabrications}
							schedule={schedule}
						/>
					</li>
				))
				.toList()
				.toArray()}
		</ul>
	)
}

class AbbreviatedCourseListing extends React.Component<
	{schedule: Schedule, fabrications: List<CourseType>},
	{courses: List<Result<CourseType>>},
> {
	state = {courses: List()}
	componentDidMount() {
		this.fetchCourses()
	}
	fetchCourses = async () => {
		let courses = await this.props.schedule.getCoursesWithErrors(
			getCourse,
			this.props.fabrications,
		)
		this.setState(() => ({courses}))
	}
	render() {
		let {courses = List()} = this.state

		return (
			<ul>
				{courses
					.map(
						(r, i) =>
							r.error ? (
								<li key={i}>{r.result.message}</li>
							) : (
								<li key={r.result.clbid}>
									{r.result.department} {r.result.number}
									{r.result.section} – {r.result.name}
								</li>
							),
					)
					.toArray()}
			</ul>
		)
	}
}

export default connect(
	undefined,
	{initStudent},
)(SISImportScreen)
