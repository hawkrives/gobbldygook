import React, {Component, PropTypes} from 'react'
import Immutable from 'immutable'
import {RouteHandler} from 'react-router'
import DocumentTitle from 'react-document-title'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'
import map from 'lodash/collection/map'

import studentStore from '../flux/student-store'
import Loading from '../components/loading'

import {areaDb} from '../lib/db'

class GobbldygookApp extends Component {
	static displayName = 'GobbldygookApp'
	static propTypes = {
		passedRequirements: PropTypes.bool.isRequired,
		routerState: PropTypes.object.isRequired,
	}

	constructor() {
		super()
		this.state = {
			students: Immutable.Map(),
			studentsInitialized: false,
			allAreas: Immutable.List(),
		}

		areaDb.allDocs({include_docs: true}) // eslint-disable-line camelcase
			.then(areas => map(areas.rows, area => area.doc))
			.then(areas => this.setState({
				allAreas: Immutable.List(areas),
			}))
	}

	componentDidMount() {
		studentStore.emitter.on('change', this.onStudentsChanged)
		studentStore.emitter.emit('change')
	}

	componentWillUnmount() {
		studentStore.emitter.off('change', this.onStudentsChanged)
	}

	onStudentsChanged = () => {
		this.setState({
			students: studentStore.students,
			studentsInitialized: true,
		})
	}

	render() {
		// if (!this.props.passedRequirements) {
		// 	return <BrowserNotSupported />
		// }

		if (!this.state.studentsInitialized) {
			return <Loading>Loading Students…</Loading>
		}

		return (
			<DocumentTitle title='Gobbldygook'>
				<RouteHandler
					allAreas={this.state.allAreas}
					students={this.state.students}
					routerState={this.props.routerState} />
			</DocumentTitle>
		)
	}
}

export default DragDropContext(HTML5Backend)(GobbldygookApp)
