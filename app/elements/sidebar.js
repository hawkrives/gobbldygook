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
	render() {
		let isSearching = 'search' in this.getQuery()
		let sidebar = isSearching ?
			React.createElement(SearchButton, {search: isSearching}) :
			React.createElement(GraduationStatus, {student: this.props.student})

		let studentButtons = React.createElement('menu', {className: 'button-list student-buttons'},
			React.createElement('button', {className: 'back'}, React.createElement(Link, {to: '/'}, 'Back')),
			React.createElement(RevertToDemoButton, {studentId: this.props.student.id}),
			React.createElement(DownloadStudentButton, {student: this.props.student}),
			React.createElement(UndoButton, null),
			React.createElement(RedoButton, null))

		return React.createElement('aside', {className: 'sidebar'}, studentButtons, sidebar)
	},
})

export default Sidebar
