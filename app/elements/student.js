import React from 'react'
import {State, RouteHandler} from 'react-router'
import Immutable from 'immutable'

import Sidebar from './sidebar'
import LoadingScreen from './loadingScreen'

class Student extends React.Component {
	constructor(props) {
		super(props)
		let queryId = props.routerState.params.id
		this.state = {
			student: null,
			message: `Loading Student ${queryId}`,
			messageClass: '',
		}
	}

	componentWillReceiveProps(nextProps) {
		let queryId = this.props.routerState.params.id
		let student = nextProps.students.get(queryId)

		if (student) {
			console.info('student\'s student: ', student.toJS())

			window.stu = student
			this.setState({student})
		}
		else {
			this.setState({message: `Could not find student "${queryId}"`, messageClass: 'error'})
			console.info('student is undefined at Student')
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	render() {
		console.info('Student#render')

		if (!this.state.student) {
			return <LoadingScreen
				className={this.state.messageClass}
				message={this.state.message} />
		}

		return <div className='student'>
			<Sidebar student={this.state.student} />
			<div className='content'>
				<RouteHandler student={this.state.student} />
			</div>
		</div>
	}
}

Student.propTypes = {
	students: React.PropTypes.instanceOf(Immutable.Map).isRequired,
	routerState: React.PropTypes.object.isRequired,
}

export default Student
