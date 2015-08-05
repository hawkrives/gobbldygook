import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'
import DocumentTitle from 'react-document-title'

import studentStore from '../flux/student-store'

import Loading from '../components/loading'

export default class GobbldygookApp extends Component {
	static displayName = 'GobbldygookApp'
	static propTypes = {
		routerState: PropTypes.object.isRequired,
	}

	constructor() {
		super()
		this.state = {
			students: Immutable.Map(),
			studentsInitialized: false,
		}
		this.onStudentsChanged = this.onStudentsChanged.bind(this)
	}

	componentDidMount() {
		studentStore.emitter.on('change', this.onStudentsChanged)
		studentStore.emitter.emit('change')
	}

	componentWillUnmount() {
		studentStore.emitter.off('change', this.onStudentsChanged)
	}

	onStudentsChanged() {
		this.setState({
			students: studentStore.students,
			studentsInitialized: true,
		})
	}

	render() {
		if (!this.state.studentsInitialized) {
			return <Loading>Loading Students…</Loading>
		}

		return (
			<DocumentTitle title='Gobbldygook'>
				<RouteHandler
					students={this.state.students}
					routerState={this.props.routerState} />
			</DocumentTitle>
		)
	}
}
