import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import React, { Component, PropTypes } from 'react'
import { DragDropContext } from 'react-dnd'

import '../index.scss'

// needs to be a stateful component: otherwise DragDropContext can't assign a ref, which it needs
// eslint-disable-next-line react/prefer-stateless-function
export class App extends Component {
	render() {
		let { content, overlay } = this.props
		return (
			<DocumentTitle title='Gobbldygook'>
				<div id='gateway-wrapper'>
					<div id='content-wrapper'>{content}</div>
					{overlay}
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
