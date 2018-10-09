// @flow

import * as React from 'react'
import {type EvaluationResult} from '@gob/examine-student'
import {Student, type AreaQuery} from '@gob/object-student'
import {checkStudentAgainstArea} from '../../workers/check-student'
import {loadArea} from '../../helpers/load-area'

type Props = {
	areaOfStudy: AreaQuery,
	student: Student,
	children: ({
		examining: boolean,
		results: ?EvaluationResult,
		error: ?string,
	}) => React.Node,
}

type State = {|
	examining: boolean,
	results: ?EvaluationResult,
	error: ?string,
|}

export class AreaOfStudyProvider extends React.Component<Props, State> {
	state = {
		examining: false,
		results: null,
		error: null,
	}

	componentDidMount() {
		this.startExamination()
	}

	componentDidUpdate(prevProps: Props) {
		if (
			this.props.student !== prevProps.student ||
			this.props.areaOfStudy !== prevProps.areaOfStudy
		) {
			this.startExamination()
		}
	}

	startExamination = async () => {
		this.setState(() => ({examining: true}))
		let area = await loadArea(this.props.areaOfStudy)

		if (area.error) {
			this.setState(() => ({examining: false, error: area.message}))
			return
		}

		let results = await checkStudentAgainstArea(
			this.props.student,
			area.data,
		)
		this.setState(() => ({examining: false, results}))
	}

	render() {
		let {examining, results, error} = this.state

		if (results && results.error) {
			error = results.error
		}

		return this.props.children({
			error,
			examining,
			results,
		})
	}
}
