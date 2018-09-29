// @flow
import * as React from 'react'
import DocumentTitle from 'react-document-title'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {loadStudent} from '../../redux/students/actions/load-student'
import type {HydratedStudentType} from '@gob/object-student'
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

export type ReduxStudentStore = {
	data: Undoable<HydratedStudentType>,
	isLoading: boolean,
	isFetching: boolean,
	isValdiating: boolean,
	isChecking: boolean,
}

type Props = {
	children: ({student: Undoable<HydratedStudentType>}) => React.Node, // from react-router
	loadStudent: string => any, // redux
	studentId: string, // react-router
	student?: ReduxStudentStore, // redux
}

type State = {
	cachedStudentId: ?string,
}

export class Student extends React.Component<Props, State> {
	state = {
		cachedStudentId: null,
	}

	static getDerivedStateFromProps(props: Props, state: State) {
		let studentId = props.studentId

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
				<p>
					Student {this.props.studentId} could not be loaded.
				</p>
			)
		}

		if (this.props.student.isLoading) {
			return <Loading>Loading Student…</Loading>
		}

		let student = this.props.student.data

		let title = student
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

const mapStateToProps = (state, ownProps) => ({
	student: state.students[ownProps.studentId],
})

const mapDispatchToProps = dispatch =>
	bindActionCreators({loadStudent}, dispatch)

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Student)
