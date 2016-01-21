import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import React, { Component, PropTypes } from 'react'
import { DragDropContext } from 'react-dnd'

import '../index.scss'

export class App extends Component {
	render() {
		return (
			<DocumentTitle title='Gobbldygook'>
				<div>
					{this.props.content}
					{this.props.overlay}
				</div>
			</DocumentTitle>
		)
	}
}

App.propTypes = {
	content: PropTypes.node.isRequired,
	overlay: PropTypes.node,
}

import StudentPicker from '../routes/app_content_student-picker/containers/student-picker'
App.defaultProps = {
	content: <StudentPicker />,
}

export default DragDropContext(HTML5Backend)(App)
