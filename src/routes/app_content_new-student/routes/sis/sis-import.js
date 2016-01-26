import React, {Component, PropTypes} from 'react'
import serializeError from 'serialize-error'
import Button from '../../../../components/button'
import getStudentInfo, {checkIfLoggedIn} from '../../../../helpers/import-student'
import convertStudent from '../../../../helpers/convert-imported-student'
import DOMify from 'react-domify'
import { push } from 'react-router-redux'
import { initStudent } from '../../../../redux/students/actions/init-student'
import {connect} from 'react-redux'

export default class SISImportScreen extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired, // redux
	};

	state = {
		loggedIn: null,
		checkingLogin: true,
		data: {},
		error: null,
	};

	componentWillMount() {
		checkIfLoggedIn()
			.then(() => this.setState({loggedIn: true, checkingLogin: false}))
			.catch(err => {
				console.error(err)
				this.setState({loggedIn: false, checkingLogin: false, error: serializeError(err)})
			})
	}

	handleImportData = () => {
		getStudentInfo()
			.then(data => {
				console.log(data)
				this.setState({student: convertStudent(data)})
			})
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

	render() {
		return <div>
			<header className='header'>
				<h1>Import from the SIS</h1>
			</header>

			<div>
				{this.state.checkingLogin
					? 'Checking login…'
					: this.state.loggedIn
						? 'Logged in!'
						: 'Not logged in.'}
			</div>

			{this.state.error ? <pre>{JSON.stringify(this.state.error)}</pre> : null}

			{this.state.student ? <DOMify value={this.state.student} /> : null}

			<div>
				<Button
					disabled={!this.state.loggedIn}
					onClick={this.handleImportData}
				>
					Import Student
				</Button>
				{this.state.student
					? <Button onClick={this.handleCreateStudent}>Let's go!</Button>
					: null}
			</div>
		</div>
	}
}


let mapDispatch = dispatch => ({dispatch})

export default connect(undefined, mapDispatch)(SISImportScreen)
