// @flow
import * as React from 'react'
import DocumentTitle from 'react-document-title'
import {connect} from 'react-redux'
import {loadStudent} from '../../redux/students/actions/load-student'
import {type IndividualStudentState} from '../../redux/students/reducers'
import {Student as StudentObject} from '@gob/object-student'
import type {Undoable} from '../../types'
import Loading from '../../components/loading'
import styled from 'styled-components'

const Container = styled.div`
	display: grid;
	justify-content: space-between;
	padding: var(--page-edge-padding);

	grid-template-columns: 1fr;

	@media all and (min-width: 600px) {
		grid-template-columns: 280px 1fr;
		grid-column-gap: calc(var(--page-edge-padding) * (2 / 3));
	}
`

type Props = {
	children: ({student: Undoable<StudentObject>}) => React.Node, // from react-router
	loadStudent: string => mixed, // redux
	studentId?: string, // react-router
	student: ?IndividualStudentState, // redux
}

type State = {}

export class Student extends React.Component<Props, State> {
	componentDidMount() {
		if (this.props.studentId && !this.props.student) {
			this.props.loadStudent(this.props.studentId)
		}
	}

	render() {
		if (!this.props.student) {
			return <p>Student {this.props.studentId} could not be loaded.</p>
		}

		let {student} = this.props

		let title: string = student
			? `${student.present.name} | Gobbldygook`
			: 'Gobbldygook'

		return (
			<Container>
				<DocumentTitle title={title} />

				{this.props.children({student})}
			</Container>
		)
	}
}

const connected = connect(
	(state, ownProps) =>
		ownProps.studentId
			? {student: state.students[ownProps.studentId]}
			: {student: undefined},
	{loadStudent},
)(Student)

export {connected as default}
