import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'

import studentStore from '../flux/studentStore'

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
		if (!this.state.studentsInitialized) {
			return <div className='loading-spinner'><div>Loading Students&hellip;</div></div>
		}

		return <RouteHandler students={this.state.students} />
	},
})

export default GobbldygookApp
