import React from 'react'
import Reflux from 'reflux'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'

import studentStore from '../flux/studentStore'
import LoadingScreen from './loadingScreen'

let GobbldygookApp = React.createClass({
	propTypes: {
		routerState: React.PropTypes.object.isRequired,
	},

	mixins: [Reflux.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged')],

	getInitialState() {
		return {
			students: Immutable.Map(),
			studentsInitialized: false,
		}
	},

	onStudentsChanged(students) {
		// console.log('app.onStudentsChanged', students)
		this.setState({students, studentsInitialized: true})
	},

	render() {
		// console.log('GobbldygookApp#render')
		if (!this.state.studentsInitialized) {
			return <LoadingScreen message="Loading Students…" />
		}

		return (<RouteHandler
					students={this.state.students}
					routerState={this.props.routerState} />)
	},
})

export default GobbldygookApp
