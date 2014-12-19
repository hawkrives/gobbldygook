import * as React from 'react'
import * as Reflux from 'reflux'
import studentStore from 'flux/studentStore'
import {RouteHandler} from 'react-router'

var GobbldygookApp = React.createClass({
	mixins: [Reflux.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged')],

	onStudentsChanged(students) {
		console.log('app.onStudentsChanged')
		this.setState({students, studentsInitialized: true})
	},

	getInitialState: function() {
		return {
			students: null,
			studentsInitialized: false,
		}
	},

	render() {
		if (!this.studentsInitialized)
			return React.createElement('img', {className: 'loading', src: 'images/loading.svg', alt: 'Gobbldygook is Loading'})

		return React.createElement(RouteHandler, {students: this.state.students})
	}
})

export default GobbldygookApp
