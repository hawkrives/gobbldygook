// @flow

import React from 'react'
import PropTypes from 'prop-types'
import serializeError from 'serialize-error'
import Button from '../../components/button'
import {
	convertStudent,
	semesterName,
	type PartialStudent,
} from '@gob/school-st-olaf-college'
import {getCourse} from '../../helpers/get-courses'
import {StudentSummary} from '../../modules/student/student-summary'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import {initStudent} from '../../redux/students/actions/init-student'
import {connect} from 'react-redux'
import withRouter from 'react-router/lib/withRouter'
import debug from 'debug'
const log = debug('web:react')
import './method-import.scss'

import type {HydratedStudentType, HydratedScheduleType} from '@gob/object-student'

type Props = {
	+dispatch: Function,
	+router: Object,
}

type State = {
	status: 'pending' | 'processing' | 'ready',
	error: ?Error,
	ids: Array<mixed>,
	selectedId: ?number,
	student: ?HydratedStudentType,
	rawStudentText: string,
	parsedStudentText: ?PartialStudent,
}

class SISImportScreen extends React.Component<Props, State> {
	static propTypes = {
		dispatch: PropTypes.func.isRequired, // redux
		router: PropTypes.object.isRequired,
	}

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
		} catch (err) {
			log(err)
			this.setState(() => ({error: serializeError(err)}))
		}
	}

	handleCreateStudent = () => {
		let action = initStudent(this.state.student)
		this.props.dispatch(action)
		this.props.router.push(`/s/${action.payload.id}`)
	}

	handleRawStudent = (ev: SyntheticInputEvent<HTMLTextAreaElement>) => {
		ev.preventDefault()

		let data = ev.currentTarget.value

		this.setState(() => ({rawStudentText: data}))

		this.setState(() => {
			try {
				return {parsedStudentText: JSON.parse(data)}
			} catch (error) {
				return {error}
			}
		}, () => {
			this.handleImportData()
		})
	}

	render() {
		let {student, error, parsedStudentText} = this.state

		return (
			<div>
				<header className="header">
					<h1>Import from the SIS</h1>
				</header>

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

				{error ? (
					<details className="error-spot">
						<summary>
							<strong>{error.name}</strong>: {error.message}
						</summary>
						<pre className="error-stack">{error.stack}</pre>
					</details>
				) : null}

				{student ? <StudentInfo student={student} /> : null}

				<div>
					{student && (
						<Button onClick={this.handleCreateStudent}>
							Import Student
						</Button>
					)}
				</div>
			</div>
		)
	}
}

const StudentInfo = ({student}: {student: HydratedStudentType}) => (
	<div>
		<StudentSummary student={student} showMessage={false} />

		<ul>
			{map(groupBy(student.schedules, s => s.year), (schedules: Array<HydratedScheduleType>, year) => (
				<li key={year}>
					{year}:
					<ul>
						{sortBy(schedules, s => s.semester).map((schedule: HydratedScheduleType) => (
							<li key={schedule.semester}>
								{semesterName(schedule.semester)}:
								<ul>
									{(schedule.courses || []).map(course => (
										<li key={course.clbid}>
											{course.department} {course.number}{course.section} – {course.name}
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	</div>
)

let mapDispatch = dispatch => ({dispatch})

export default connect(
	undefined,
	mapDispatch,
)(withRouter(SISImportScreen))
