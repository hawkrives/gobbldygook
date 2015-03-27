import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'

import studentStore from '../flux/studentStore'
import LoadingScreen from './loadingScreen'

let GobbldygookApp = React.createClass({
	mixins: [Reflux.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged')],

	propTypes: {
		routerState: React.PropTypes.object.isRequired,
	},

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
			return <LoadingScreen message="Loading Students…" />
		}

		return <RouteHandler
			students={this.state.students}
			routerState={this.props.routerState} />
	},
})

export default GobbldygookApp
