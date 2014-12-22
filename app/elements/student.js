import * as React from 'react'
import {State, RouteHandler} from 'react-router'

import Sidebar from 'elements/sidebar'

var Student = React.createClass({
	mixins: [State],

	getInitialState: function() {
		return { student: null }
	},

	componentWillReceiveProps: function(nextProps) {
		let queryId = this.getParams().id
		let student = nextProps.students.get(queryId)
		console.info('student\'s student: ', student.toJS())

		window.stu = student
		this.setState({student})
	},

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.student !== this.state.student
	},

	render() {
		console.info('student render', this.props.students.toJS())

		if (!this.state.student)
			return React.createElement('img', {
				className: 'loading',
				src: 'images/loading.svg',
				alt: 'Gobbldygook is Loading',
			})

		return React.createElement('div',
			{className: 'student'},
			React.createElement(Sidebar, {student: this.state.student}),
			React.createElement(RouteHandler, {student: this.state.student}))
	},
})

export default Student
