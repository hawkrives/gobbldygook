import DocumentTitle from 'react-document-title'
import HTML5Backend from 'react-dnd-html5-backend'
import React, { Component, PropTypes } from 'react'
import { DragDropContext } from 'react-dnd'
import {GatewayProvider, GatewayDest} from 'react-gateway'

import '../index.scss'

import ReactModal2 from 'react-modal2'
ReactModal2.getApplicationElement = () => document.getElementById('blah')

export class App extends Component {
	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
	}

	render() {
		return (
			<DocumentTitle title='Gobbldygook'>
				<GatewayProvider>
					<div id='wrapper'>
						<div id='blah'>{this.props.content}</div>
						<GatewayDest name='modal' className='modal-container' />
					</div>
				</GatewayProvider>
			</DocumentTitle>
		)
	}
}

App.propTypes = {
	content: PropTypes.node.isRequired,
}

import StudentPicker from '../routes/app_content_student-picker/containers/student-picker'
App.defaultProps = {
	content: <StudentPicker />,
}

export default DragDropContext(HTML5Backend)(App)
