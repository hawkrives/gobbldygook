import React, {Component, PropTypes, cloneElement} from 'react'
import Immutable from 'immutable'
import DocumentTitle from 'react-document-title'
import {DragDropContext} from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

import studentStore, {REFRESH_AREAS, REFRESH_COURSES} from '../flux/student-store'
import Loading from '../components/loading'

import db from '../lib/db'

class GobbldygookApp extends Component {
	static propTypes = {
		children: PropTypes.node,
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
				{cloneElement(this.props.children, {
					allAreas: this.state.allAreas,
					students: this.state.students,
				})}
			</DocumentTitle>
		)
	}
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(GobbldygookApp)
