import * as React from 'react'
import * as Reflux from 'reflux'
import * as Immutable from 'immutable'
import studentStore from 'flux/studentStore'
import {RouteHandler} from 'react-router'

window.ref = Reflux

var GobbldygookApp = React.createClass({
	mixins: [Reflux.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged')],

	onStudentsChanged(students) {
		console.log('app.onStudentsChanged', students)
		this.setState({students, studentsInitialized: true})
	},

	getInitialState() {
		return {
			students: Immutable.Map(),
			studentsInitialized: false,
		}
	},

	render() {
		console.log('rendering GobbldygookApp', this.state.studentsInitialized)
		if (!this.state.studentsInitialized)
			return React.createElement('img', {
				className: 'loading',
				src: 'images/loading.svg',
				alt: 'Gobbldygook is Loading',
			})

		return React.createElement(RouteHandler, {students: this.state.students})
	},
})

export default GobbldygookApp
