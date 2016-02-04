import React, {Component, PropTypes} from 'react'
import serializeError from 'serialize-error'
import Button from '../../../../components/button'
import getStudentInfo, {checkIfLoggedIn} from '../../../../helpers/import-student'
import convertStudent from '../../../../helpers/convert-imported-student'
import StudentSummary from '../../../app_content_student/components/student-summary'
import map from 'lodash/map'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import semesterName from '../../../../helpers/semester-name'
import RadioGroup from 'react-radio-group'
import { push } from 'react-router-redux'
import { initStudent } from '../../../../redux/students/actions/init-student'
import { connect } from 'react-redux'

export default class SISImportScreen extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired, // redux
	};

	state = {
		loggedIn: null,
		checkingLogin: true,
		error: null,
		ids: [],
		selectedId: null,
		student: null,
	};

	componentWillMount() {
		this.checkLoginState()
	}

	checkLoginState = () => {
		checkIfLoggedIn()
			.then(ids => {
				if (ids.length === 1) {
					this.setState({loggedIn: true, checkingLogin: false, selectedId: ids[0]})
				}
				else {
					this.setState({loggedIn: true, checkingLogin: false, ids})
				}
			})
			.catch(() => this.setState({loggedIn: false, checkingLogin: false}))
	};

	handleImportData = () => {
		getStudentInfo(this.state.selectedId)
			.then(data => {
				console.log(data)
				return data
			})
			.then(convertStudent)
			.then(student => this.setState({student}))
			.catch(err => {
				console.error(err)
				this.setState({error: serializeError(err)})
			})
	};

	handleCreateStudent = () => {
		let action = initStudent(this.state.student)
		this.props.dispatch(action)
		this.props.dispatch(push(`/s/${action.payload.id}`))
	};

	handleSelectId = value => {
		this.setState({selectedId: value})
		this.handleImportData()
	};

	render() {
		let {
			student,
			checkingLogin,
			loggedIn,
			error,
			ids,
		} = this.state

		return (
			<div>
				<header className='header'>
					<h1>Import from the SIS</h1>
				</header>

				<p>
					Warning! Currently under development. Will most likely be broken.
				</p>

				<p>
					{checkingLogin
						? 'Checking login…'
						: loggedIn
							? "Great! You\'re logged in."
							: 'Not logged in. Please log in to the SIS in another tab.'}
				</p>

				{error ? <p>{error.message}</p> : null}

				{!loggedIn ? <Button disabled={checkingLogin} onClick={this.checkLoginState}>Check Again</Button> : null}

				{ids.length > 1 ? <div>
					<p>Hang on one second… we found multiple student IDs. Which one is yours?</p>
					<RadioGroup name='student-id' value={this.state.selectedId} onChange={this.handleSelectId}>
						{Radio =>
							<div>
								{map(ids, id =>
									<label><Radio value={id} /> {id}</label>
								)}
							</div>
						}
					</RadioGroup>
				</div> : null}

				{student
					? <div>
						<StudentSummary student={student} showMessage={false} />
						<ul>
							{map(groupBy(student.schedules, 'year'), (schedules, year) =>
								<li>{year}:
									<ul>
										{map(sortBy(schedules, 'semester'), schedule =>
											<li>{semesterName(schedule.semester)}: {JSON.stringify(schedule.courses, null, 2)}
												<ul>
													{map(schedule.courses, course => {
														<li>{course.deptnum} – {course.name}</li>
													})}
												</ul>
											</li>
										)}
									</ul>
								</li>
							)}
						</ul>
					</div>
					: null}

				<div>
					{loggedIn ? student
						? <Button onClick={this.handleCreateStudent}>Import Student</Button>
						: <Button disabled={!loggedIn} onClick={this.handleImportData}>Fetch Student</Button>
					: null}
				</div>
			</div>
		)
	}
}


let mapDispatch = dispatch => ({dispatch})

export default connect(undefined, mapDispatch)(SISImportScreen)
