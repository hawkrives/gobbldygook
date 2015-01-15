import React from 'react'
import {State, RouteHandler} from 'react-router'

import Sidebar from './sidebar'

let Student = React.createClass({
	mixins: [State],

	getInitialState: function() {
		let queryId = this.getParams().id
		return {
			student: null,
			message: `Loading Student ${queryId}`,
			messageClass: '',
		}
	},

	componentWillReceiveProps: function(nextProps) {
		let queryId = this.getParams().id
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
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	// shouldComponentUpdate(nextProps, nextState) {
		// return nextState.student !== this.state.student
	// },

	render() {
		console.info('list of students in Student', this.props.students.toJS())

		if (!this.state.student)
			return React.createElement('figure', {className: 'loading'},
				React.createElement('img', {
					className: 'loading-spinner',
					src: 'images/loading.svg',
					alt: 'Gobbldygook is Loading',
				}),
				React.createElement('figcaption', {className: 'loading-message ' + this.state.messageClass}, this.state.message))

		return React.createElement('div',
			{className: 'student'},
			React.createElement(Sidebar, {student: this.state.student, settings: this.props.settings}),
			React.createElement('div', {className: 'content'},
				React.createElement(RouteHandler, {student: this.state.student, settings: this.props.settings})))
	},
})

export default Student
