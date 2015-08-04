import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import {ListenerMethods} from 'reflux'
import {RouteHandler} from 'react-router'

import studentStore from '../flux/student-store'

import Loading from '../components/loading'

export default class GobbldygookApp extends Component {
	static propTypes = {
		routerState: PropTypes.object.isRequired,
	}

	constructor() {
		super()
		this.state = {
			students: Immutable.Map(),
			studentsInitialized: false,
		}
	}

	componentDidMount() {
        ListenerMethods.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged').bind(this)
	}

	componentWillUnmount() {
		ListenerMethods.stopListeningToAll()
	}

	// mixins: [Reflux.listenTo(studentStore, 'onStudentsChanged', 'onStudentsChanged')]

	onStudentsChanged(students) {
		this.setState({
			students,
			studentsInitialized: true,
		})
	}

	render() {
		if (!this.state.studentsInitialized) {
			return <Loading>Loading Students…</Loading>
		}

		return (<RouteHandler
					students={this.state.students}
					routerState={this.props.routerState} />)
	}
}
