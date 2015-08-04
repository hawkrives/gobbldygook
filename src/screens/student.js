import React, {Component, PropTypes} from 'react'
import {RouteHandler} from 'react-router'
import Immutable from 'immutable'

import Sidebar from './sidebar'
import Loading from '../components/loading'

export default class Student extends Component {
	static propTypes = {
		routerState: PropTypes.object.isRequired,
		students: PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			student: null,
			message: `Loading Student ${props.routerState.params.id}`,
			messageClass: '',
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps)
		let queryId = this.props.routerState.params.id
		let student = nextProps.students.get(queryId)

		if (student) {
			// console.info('student\'s student: ', student.toJS())

			window.stu = student
			this.setState({student})
		}
		else {
			this.setState({
				message: `Could not find student "${queryId}"`,
				messageClass: 'error',
			})
			// console.info('student is undefined at Student')
		}
	}

	render() {
		// console.info('Student#render')

		if (!this.state.student) {
			return <Loading className={this.state.messageClass}>{this.state.message}</Loading>
		}

		return (
			<div className='student'>
				<Sidebar student={this.state.student} />
				<RouteHandler className='content' student={this.state.student} />
			</div>
		)
	}
}
