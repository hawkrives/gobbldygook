// @flow

import * as React from 'react'
import {List, Map} from 'immutable'
import {countCredits} from '@gob/examine-student'
import {
	Student,
	Schedule,
	type WarningType,
	type FabricationType,
} from '@gob/object-student'
import type {Course as CourseType, CourseError} from '@gob/types'
import {getOnlyCourse, getCourse} from '../../helpers/get-courses'
import {loadDataForTerm} from '../../workers/load-data'

export type ChildrenProps = {
	loading: boolean,
	checking: boolean,
	courses: List<CourseType | FabricationType | CourseError>,
	warnings: Map<string, List<WarningType>>,
	hasConflict: boolean,
	credits: number,
}

type Props = {
	schedule: Schedule,
	student: Student,
	children: ChildrenProps => React.Node,
}

type State = {
	loading: boolean,
	checking: boolean,
	courses: List<CourseType | FabricationType | CourseError>,
	warnings: Map<string, List<WarningType>>,
	hasConflict: boolean,
	credits: number,
}

export class ScheduleProvider extends React.Component<Props, State> {
	state = {
		loading: true,
		checking: true,
		courses: List(),
		warnings: Map(),
		hasConflict: false,
		credits: 0,
	}

	componentDidMount() {
		this.ensureDataExists()
		this.prepare(this.props)
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.schedule !== prevProps.schedule) {
			this.prepare(this.props)
		}
	}

	ensureDataExists = async () => {
		await loadDataForTerm(parseInt(this.props.schedule.getTerm()))
	}

	prepare = async (props: Props) => {
		let {fabrications} = props.student
		let {schedule} = props

		this.setState(() => ({loading: true, checking: true}))

		let courses = await schedule.getCourses(getCourse, fabrications)
		let credits = countCredits([...courses])

		this.setState(() => ({courses, credits, loading: false}))

		let {warnings, hasConflict} = await schedule.validate(getOnlyCourse)

		this.setState(() => ({warnings, hasConflict, checking: false}))
	}

	render() {
		let {
			courses,
			credits,
			warnings,
			hasConflict,
			loading,
			checking,
		} = this.state

		return this.props.children({
			loading,
			checking,
			courses,
			warnings,
			hasConflict,
			credits,
		})
	}
}
