import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import map from 'lodash/collection/map'
import React, {Component, PropTypes, cloneElement} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
const { ActionCreators: { undo, redo } } = require('redux-undo')

import * as actionCreators from '../ducks/actions/students'

import '../index.scss'

export class App extends Component {
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired,
		areas: PropTypes.array,
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
				<div>
					<div>Here!</div>
					<button disabled={this.props.students.past.length === 0} onClick={this.props.actions.undo}>Undo</button>
					<button disabled={this.props.students.future.length === 0} onClick={this.props.actions.redo}>Redo</button>
					<ul>
						{map(this.props.students.present, (s, i) =>
							<li key={i}>{s.id} {s.name}</li>)}
					</ul>
					<ul>
						{map(this.props.areas, (s, i) =>
							<li key={i}>{s.name}</li>)}
					</ul>
				</div>
				{/*cloneElement(this.props.children, {
					allAreas: this.state.allAreas,
					students: this.props.students,
				})*/}
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
			undo: () => dispatch(undo()),
			redo: () => dispatch(redo()),
		},
	}
}

const draggable = DragDropContext(HTML5Backend)(App)
const connected = connect(mapStateToProps, mapDispatchToProps)(draggable)

export default connected
