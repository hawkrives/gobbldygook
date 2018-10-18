// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'
import {Student} from '@gob/object-student'
import type {Undoable} from '../../types'
import {Sidebar} from '../../components/sidebar'

import StudentOverview from '../../modules/student'

import CourseTable from '../../modules/course-table'
import {StudentToolbar} from '../../modules/student/toolbar'

const SemesterDetail = Loadable({
	loader: () => import('../../modules/semester-detail'),
	loading: LoadingComponent,
})

export default function StudentIndex(props: {
	studentId?: string,
	location?: {search: string},
	navigate?: string => mixed,
}) {
	let {location, studentId, navigate} = props

	if (!studentId) {
		return <p>Student {this.props.studentId} could not be loaded.</p>
	}

	if (!location || !navigate) {
		return <p>Error: @reach/router did not pass location or navigate!</p>
	}

	let params = new URLSearchParams(location.search)

	return (
		<StudentOverview studentId={props.studentId}>
			{({student}) => (
				<>
					<StudentToolbar student={student.present} />

					<Router>
						<CourseTable default student={student.present} />

						<SemesterDetail
							path="/term/:term"
							student={student.present}
						/>
					</Router>
				</>
			)}
		</StudentOverview>
	)
}

CourseTable.preload()
