import React from 'react'
import {Link, State} from 'react-router'

import RevertToDemoButton from '../components/revertToDemoButton'
import DownloadStudentButton from '../components/downloadStudentButton'
import UndoButton from '../components/undoButton'
import RedoButton from '../components/redoButton'

import SearchButton from './searchButton'
import GraduationStatus from './graduationStatus'

let Sidebar = React.createClass({
	mixins: [State],

	propTypes: {
		student: React.PropTypes.object.isRequired,
	},

	toggleSearch() {
		this.setState({isSearching: !this.state.isSearching})
	},

	getInitialState() {
		return {
			isSearching: false,
		}
	},

	render() {
		let student = this.props.student

		let component = GraduationStatus
		let props = {student}
		if (this.state.isSearching) {
			component = SearchButton
			props.toggle = this.toggleSearch
		}

		let sidebar = React.createElement(component, props)

		let studentButtons = React.createElement('menu', {className: 'button-list student-buttons'},
			React.createElement('button',
				{className: 'back'},
				React.createElement(Link, {to: '/'}, 'Back')),
			React.createElement('button',
				{className: 'search', onClick: this.toggleSearch},
				'Search'),
			React.createElement(DownloadStudentButton, {student}),
			React.createElement(RevertToDemoButton, {studentId: student.id}),
			React.createElement(UndoButton, null),
			React.createElement(RedoButton, null))

		return React.createElement('aside', {className: 'sidebar'}, studentButtons, sidebar)
	},
})

export default Sidebar
