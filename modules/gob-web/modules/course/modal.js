// @flow

import React from 'react'
import styled from 'styled-components'
import Modal from '../../components/modal'
import Separator from '../../components/separator'
import {Toolbar} from '../../components/toolbar'
import {FlatButton, RaisedButton} from '../../components/button'
import {SemesterSelector} from './semester-selector'
import ExpandedCourse from './expanded'
import * as theme from '../../theme'
import type {Course as CourseType} from '@gob/types'
import {List} from 'immutable'
import {type WarningType} from '../../../gob-object-student/find-course-warnings'
import {Student} from '@gob/object-student'
import {connect} from 'react-redux'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'

const ContainerModal = styled(Modal)`
	${theme.baseCard};
	display: flex;
	flex-flow: column;
	max-width: 45em;

	p,
	ul,
	ol {
		margin: 0;
	}
`

const BottomToolbar = styled.div`
	padding: 10px 20px;
	border-top: 1px solid rgba(160, 160, 160, 0.2);
	margin-top: 0.5em;
	padding-top: 0.5em;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
`

const RemoveCourseButton = styled(FlatButton)`
	color: var(--red-500);
	padding-left: 0.5em;
	padding-right: 0.5em;
	font-size: 0.85em;
	&:hover {
		background-color: var(--red-50);
		border-color: var(--red-500);
	}
`

const Course = styled(ExpandedCourse)`
	padding: 0 20px;
`

type Props = {
	course: CourseType,
	conflicts: ?List<WarningType>,
	onClose: () => any,
	scheduleId?: string,
	studentId?: string,
	student: ?Student, // redux
	changeStudent: ChangeStudentFunc, // redux
}

class ModalCourse extends React.Component<Props> {
	remove = () => {
		let {student, course, scheduleId} = this.props
		if (!student || !scheduleId) {
			return
		}
		let s = student.removeCourseFromSchedule(scheduleId, course.clbid)
		this.props.changeStudent(s)
	}

	render() {
		let {course, student, scheduleId, onClose, conflicts} = this.props

		return (
			<ContainerModal onClose={onClose} contentLabel="Course">
				<Toolbar>
					<Separator type="flex-spacer" flex={3} />
					<RaisedButton onClick={onClose}>Close</RaisedButton>
				</Toolbar>

				<Course conflicts={conflicts} course={course} />

				<BottomToolbar>
					{scheduleId && student ? (
						<SemesterSelector
							scheduleId={scheduleId}
							student={student}
							clbid={course.clbid}
						/>
					) : null}
					{scheduleId && student ? (
						<RemoveCourseButton onClick={this.remove}>
							Remove Course
						</RemoveCourseButton>
					) : null}
				</BottomToolbar>
			</ContainerModal>
		)
	}
}

const connected = connect(
	(state, ownProps) =>
		ownProps.studentId && ownProps.studentId in state.students
			? {student: state.students[ownProps.studentId].present}
			: {student: undefined},
	{changeStudent},
)(ModalCourse)

export {connected as ModalCourse}
