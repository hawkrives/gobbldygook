// @flow
import React, {Component, cloneElement} from 'react'
import DocumentTitle from 'react-document-title'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {loadStudent} from '../../redux/students/actions/load-student'

import Sidebar from '../../components/sidebar'
import Loading from '../../components/loading'

import CourseTable from '../course-table'
import GraduationStatus from './graduation-status'

import './student.scss'

type StudentType = Object
type Props = {
	content: React$Element<any>, // from react-router
	loadStudent: string => any, // redux
	overlay: ?React$Element<any>,
	params: {studentId: string}, // react-router
	sidebar: ?React$Element<any>, // from react-router
	student: StudentType, // redux
}

type State = {
	cachedStudentId: ?string,
}

export class Student extends Component<Props, State> {
	state = {
		cachedStudentId: null,
	}

	static getDerivedStateFromProps(props: Props, state: State) {
		let studentId = props.params.studentId

		// We have to be able to load the student here because we only load
		// students on-demand into the redux store
		const didStudentChange = studentId !== state.cachedStudentId

		if (!props.student || didStudentChange) {
			props.loadStudent(studentId)
		}

		return {cachedStudentId: studentId}
	}

	render() {
		if (!this.props.student) {
			return (
				<div>
					Student {this.props.params.studentId} could not be loaded.
				</div>
			)
		}

		if (this.props.student.isLoading) {
			return <Loading>Loading Student…</Loading>
		}

		const name = this.props.student
			? this.props.student.data.present.name
			: 'Loading…'

		const contentProps = {
			student: this.props.student,
			className: 'content',
		}
		const contents = this.props.content ? (
			cloneElement(this.props.content, contentProps)
		) : (
			<CourseTable {...contentProps} />
		)

		const sidebarProps = {student: this.props.student.data.present}
		const sidebar = this.props.sidebar ? (
			cloneElement(this.props.sidebar, sidebarProps)
		) : (
			<GraduationStatus {...sidebarProps} />
		)

		return (
			<DocumentTitle title={`${name} | Gobbldygook`}>
				<div className="student">
					<Sidebar student={this.props.student}>{sidebar}</Sidebar>
					{contents}
					{this.props.overlay || null}
				</div>
			</DocumentTitle>
		)
	}
}

const mapStateToProps = (state, ownProps) => ({
	student: state.students[ownProps.params.studentId],
})

const mapDispatchToProps = dispatch =>
	bindActionCreators({loadStudent}, dispatch)

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Student)
