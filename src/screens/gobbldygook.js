import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'
import DocumentTitle from 'react-document-title'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'

import studentStore, {REFRESH_AREAS, REFRESH_COURSES} from '../flux/student-store'
import Loading from '../components/loading'

import db from '../lib/db'

class GobbldygookApp extends Component {
	static propTypes = {
		routerState: PropTypes.object.isRequired,
	}

	constructor() {
		super()
		this.state = {
			students: Immutable.Map(),
			studentsInitialized: false,
			allAreas: Immutable.List(),
		}

		this.onAreasRefreshed()
	}

	componentDidMount() {
		studentStore.emitter.on('change', this.onStudentsChanged)
		studentStore.emitter.on(REFRESH_AREAS, this.onAreasRefreshed)
		studentStore.emitter.emit('change')
	}

	componentWillUnmount() {
		studentStore.emitter.off('change', this.onStudentsChanged)
		studentStore.emitter.off(REFRESH_AREAS, this.onAreasRefreshed)
	}

	onStudentsChanged = () => {
		this.setState({
			students: studentStore.students,
			studentsInitialized: true,
		})
	}

	onAreasRefreshed = () => {
		db.stores.areas.all().then(areas => this.setState({
			allAreas: Immutable.List(areas),
		}))
	}

	render() {
		if (!this.state.studentsInitialized) {
			return <Loading>Loading Students…</Loading>
		}

		return (
			<DocumentTitle title='Gobbldygook'>
				<RouteHandler
					allAreas={this.state.allAreas}
					students={this.state.students}
					routerState={this.props.routerState}
				/>
			</DocumentTitle>
		)
	}
}

export default DragDropContext(HTML5Backend)(GobbldygookApp)
