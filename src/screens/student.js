import React, {Component, PropTypes} from 'react'
import {RouteHandler} from 'react-router'
import Immutable from 'immutable'
import DocumentTitle from 'react-document-title'

import Sidebar from './sidebar'
import Loading from '../components/loading'

import './student.scss'

export default class Student extends Component {
	static propTypes = {
		allAreas: PropTypes.instanceOf(Immutable.List).isRequired,
		routerState: PropTypes.object.isRequired,
		students: PropTypes.instanceOf(Immutable.Map).isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			allAreas: Immutable.List(),
			courses: Immutable.List(),
			coursesLoaded: false,
			message: `Loading Student ${props.routerState.params.id}`,
			messageClass: '',
			student: null,
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
			student.courses.then(courses => this.setState({
				courses: Immutable.List(courses),
				coursesLoaded: true,
			}))
		}
		else {
			this.setState({
				message: `Could not find student "${queryId}"`,
				messageClass: 'error',
			})
		}
	}

	render() {
		// console.info('Student#render')

		if (!this.state.student) {
			return <Loading className={this.state.messageClass}>{this.state.message}</Loading>
		}

		return (
			<DocumentTitle title={`${this.state.student.name} | Gobbldygook`}>
				<div className='student'>
					<Sidebar
						allAreas={this.props.allAreas}
						courses={this.state.courses}
						coursesLoaded={this.state.coursesLoaded}
						student={this.state.student}
					/>
					<RouteHandler
						className='content'
						student={this.state.student}
						courses={this.state.courses}
						coursesLoaded={this.state.coursesLoaded}
					/>
				</div>
			</DocumentTitle>
		)
	}
}
