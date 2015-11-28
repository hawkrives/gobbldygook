import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import React, {Component, PropTypes, cloneElement} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import { ActionCreators as UndoableActionCreators } from 'redux-undo'

import * as actionCreators from '../ducks/actions/students'

import '../index.scss'

export class App extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired,
		areas: PropTypes.array.isRequired,
		children: PropTypes.node,
		students: PropTypes.shape({ // a history object!
			past: PropTypes.arrayOf(PropTypes.object),
			present: PropTypes.object,
			future: PropTypes.arrayOf(PropTypes.object),
		}),
	}

	render() {
		return (
			<DocumentTitle title='Gobbldygook'>
				{cloneElement(this.props.children, {
					actions: this.props.actions,
					areas: this.props.areas,
					students: this.props.students,
				})}
			</DocumentTitle>
		)
	}
}


function mapStateToProps(state) {
	// selects some state that is relevant to this component, and returns it.
	// redux-react will bind it to props.
	return {
		areas: state.areas,
		students: state.students,
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
