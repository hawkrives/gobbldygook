import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import React, { Component, PropTypes, cloneElement } from 'react'
import { DragDropContext } from 'react-dnd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ActionCreators as UndoableActionCreators } from 'redux-undo'
import * as actionCreators from '../ducks/actions/students'
import omit from 'lodash/object/omit'
import CourseSearcherSheet from './course-searcher-sheet'
import NewStudentSheet from './new-student-wizard'

import '../index.scss'

export class App extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired,
		areas: PropTypes.array.isRequired,
		canRedo: PropTypes.bool.isRequired,
		canUndo: PropTypes.bool.isRequired,
		children: PropTypes.node.isRequired,
		students: PropTypes.object.isRequired,
	}

	static contextTypes = {
		location: PropTypes.object,
	}

	render() {
		return (
			<DocumentTitle title='Gobbldygook'>
				<div>
					{cloneElement(this.props.children, omit(this.props, 'children'))}
					{'search-overlay' in this.context.location.query &&
						<CourseSearcherSheet actions={this.props.actions} />}
					{'student-wizard' in this.context.location.query &&
						<NewStudentSheet actions={this.props.actions} />}
				</div>
			</DocumentTitle>
		)
	}
}

function mapStateToProps(state) {
	// selects some state that is relevant to this component, and returns it.
	// redux-react will bind it to props.
	return {
		areas: state.areas,
		canRedo: state.students.future.length !== 0,
		canUndo: state.students.past.length !== 0,
		students: state.students.present,
	}
}

function mapDispatchToProps(dispatch) {
	// binds the actions creators to this dispatch function.
	// then passes the keys of the returned object as props to the connect()-ed component
	return {
		actions: {
			...bindActionCreators(actionCreators, dispatch),
			undo: () => dispatch(UndoableActionCreators.undo()),
			redo: () => dispatch(UndoableActionCreators.redo()),
		},
	}
}

const draggable = DragDropContext(HTML5Backend)(App)
const connected = connect(mapStateToProps, mapDispatchToProps)(draggable)
export default connected
