// @flow

import React from 'react'
import PropTypes from 'prop-types'
import StudentPicker from './student-picker'
import {connect} from 'react-redux'
import {destroyStudent} from '../../redux/students/actions/destroy-student'
import {loadStudents} from '../../redux/students/actions/load-students'
import type {ReduxStudentStore} from '../student/student'
import {type SORT_BY_ENUM} from './types'

type Props = {
	destroyStudent: string => mixed,
	loadStudents: () => mixed,
	students: {[key: string]: ReduxStudentStore},
}

type State = {
	filterText: string,
	isEditing: boolean,
	sortBy: SORT_BY_ENUM,
	groupBy: 'nothing',
}

class StudentPickerContainer extends React.Component<Props, State> {
	static propTypes = {
		destroyStudent: PropTypes.func.isRequired,
		loadStudents: PropTypes.func.isRequired,
		students: PropTypes.object.isRequired,
	}

	state = {
		filterText: '',
		isEditing: false,
		sortBy: 'dateLastModified',
		groupBy: 'nothing',
	}

	componentDidMount() {
		this.props.loadStudents()
	}

	onFilterChange = (ev: SyntheticInputEvent<HTMLInputElement>) => {
		let searchText = ev.currentTarget.value || ''
		this.setState(() => ({filterText: searchText.toLowerCase()}))
	}

	onGroupChange = () => {}

	onSortChange = () => {
		const options = ['dateLastModified', 'name']
		const currentIndex = options.indexOf(this.state.sortBy)
		const nextIndex = (currentIndex + 1) % options.length
		this.setState(() => ({sortBy: options[nextIndex]}))
	}

	onToggleEditing = () => {
		this.setState(() => ({isEditing: !this.state.isEditing}))
	}

	render() {
		return (
			<StudentPicker
				destroyStudent={this.props.destroyStudent}
				filterText={this.state.filterText}
				groupBy={this.state.groupBy}
				isEditing={this.state.isEditing}
				onFilterChange={this.onFilterChange}
				onGroupChange={this.onGroupChange}
				onSortChange={this.onSortChange}
				onToggleEditing={this.onToggleEditing}
				sortBy={this.state.sortBy}
				students={this.props.students}
			/>
		)
	}
}

export default connect(
	state => ({students: state.students}),
	{destroyStudent, loadStudents},
)(StudentPickerContainer)
