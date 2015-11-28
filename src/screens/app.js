import DocumentTitle from 'react-document-title'
import HotKeys from 'react-hotkeys'
import HTML5Backend from 'react-dnd-html5-backend'
import React, {Component, PropTypes, cloneElement} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import { undoAction, redoAction } from 'redux-undo'

import * as actionCreators from '../ducks/actions/students'
import db from '../helpers/db'

import '../index.scss'

class App extends Component {
	static propTypes = {
		actions: PropTypes.arrayOf(PropTypes.func).isRequired,
		children: PropTypes.node,
		dispatch: PropTypes.func.isRequired,
		students: PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
			allAreas: [],
		}

		db.stores.areas.all().then(areas => this.setState({
			allAreas: areas,
		}))
	}

	render() {
		const keyMap = {
			undo: 'command+z',
			redo: 'command+shift+z',
		}

		const handlers = {
			undo: () => this.props.dispatch(undoAction()),
			redo: () => this.props.dispatch(redoAction()),
		}

		return (
			<DocumentTitle title='Gobbldygook'>
				<HotKeys map={keyMap} handlers={handlers}>
					{cloneElement(this.props.children, {
						allAreas: this.state.allAreas,
						students: this.props.students,
					})}
				</HotKeys>
			</DocumentTitle>
		)
	}
}


function mapStateToProps(state) {
	// selects some state that is relevant to this component, and returns it.
	// redux-react will bind it to props.
	return {
		students: state.students,
	}
}

function mapDispatchToProps(dispatch) {
	// binds the actions creators to this dispatch function.
	// then passes the keys of the returned object as props to the connect()-ed component
	return {
		actions: bindActionCreators(actionCreators, dispatch),
		dispatch: dispatch,
	}
}

export default (
	connect(mapStateToProps, mapDispatchToProps)
	(DragDropContext(HTML5Backend))
	(App)
)
