import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'

import studentStore from 'app/flux/studentStore'

let GobbldygookApp = React.createClass({
	mixins: [Reflux.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged')],

	onStudentsChanged(students) {
		// console.log('app.onStudentsChanged', students)
		this.setState({students, studentsInitialized: true})
	},

	getInitialState() {
		return {
			students: Immutable.Map(),
			studentsInitialized: false,
		}
	},

	render() {
		// console.log('rendering GobbldygookApp', this.state.studentsInitialized)
		if (!this.state.studentsInitialized)
			return React.createElement('div', {className: 'loading-spinner'}, React.createElement('div', null), 'Loading Students&hellip;')

		return React.createElement(RouteHandler, {students: this.state.students})
	},
})

export default GobbldygookApp
