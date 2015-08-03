import React, {Component, PropTypes} from 'react'
import {ListenerMethods} from 'reflux'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'

import studentStore from '../flux/studentStore'
import LoadingScreen from './loadingScreen'

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
			return <LoadingScreen message="Loading Students…" />
		}

		return (<RouteHandler
					students={this.state.students}
					routerState={this.props.routerState} />)
	}
}
