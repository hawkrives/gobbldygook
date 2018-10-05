// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'
import {Student} from '@gob/object-student'
import type {Undoable} from '../../types'

import StudentOverview from '../../modules/student'

const SearchSidebar = Loadable({
	loader: () =>
		import('../../components/sidebar--course-search').then(
			mod => mod.CourseSearcherSidebar,
		),
	loading: LoadingComponent,
})

import CourseRemovalBox from '../../components/course-removal-box'
import {ConnectedSidebarToolbar} from '../../components/sidebar'
import {AreaOfStudySidebar} from '../../modules/student/area-of-study-sidebar'
import {StudentSummary} from '../../modules/student/student-summary'

const StatusSidebar = ({student}: {student: Undoable<Student>}) => (
	<aside>
		<ConnectedSidebarToolbar
			backTo="picker"
			search={true}
			share={true}
			student={student}
		/>
		<CourseRemovalBox student={student.present} />
		<StudentSummary student={student.present} />
		<AreaOfStudySidebar student={student.present} />
	</aside>
)

const CourseTable = Loadable({
	loader: () => import('../../modules/course-table'),
	loading: LoadingComponent,
})

const ShareStudentOverlay = Loadable({
	loader: () => import('./share-student'),
	loading: LoadingComponent,
})

const SemesterDetail = Loadable({
	loader: () => import('../../modules/semester-detail'),
	loading: LoadingComponent,
})

const TermSidebar = ({student}: {student: Undoable<Student>}) => (
	<aside>
		<ConnectedSidebarToolbar
			backTo="overview"
			search={false}
			share={false}
			student={student}
		/>
	</aside>
)

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
					<Router>
						<StatusSidebar path="/" student={student} />

						<SearchSidebar
							path="/search"
							term={params.get('term')}
							student={student}
							navigate={navigate}
						/>

						<TermSidebar
							path="/term/:term"
							student={student}
							navigate={navigate}
						/>
					</Router>

					<Router>
						<CourseTable default student={student.present} />

						<SemesterDetail
							student={student.present}
							path="/term/:term"
						/>
					</Router>

					{params.has('share') && (
						<ShareStudentOverlay
							student={student.present}
							navigate={navigate}
							location={location}
						/>
					)}
				</>
			)}
		</StudentOverview>
	)
}

CourseTable.preload()
