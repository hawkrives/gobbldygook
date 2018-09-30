// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'

import Student from '../../modules/student'

const Sidebar = Loadable({
	loader: () => import('../../components/sidebar'),
	loading: LoadingComponent,
})

const SearchSidebar = Loadable({
	loader: () => import('../../components/sidebar--course-search'),
	loading: LoadingComponent,
})

const AreaOfStudySidebar = Loadable({
	loader: () =>
		import('../../modules/student/area-of-study-sidebar').then(
			mod => mod.AreaOfStudySidebar,
		),
	loading: LoadingComponent,
})

const StudentSummary = Loadable({
	loader: () =>
		import('../../modules/student/connected-student-summary').then(
			mod => mod.ConnectedStudentSummary,
		),
	loading: LoadingComponent,
})

const StatusSidebar = ({student}) => (
	<>
		<StudentSummary student={student.present} />
		<AreaOfStudySidebar student={student.present} />
	</>
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

export default function StudentIndex(props: {
	studentId: string,
	location: {},
	navigate: string => mixed,
}) {
	let params = new URLSearchParams(location.search)

	return (
		<Student studentId={props.studentId}>
			{({student}) => (
				<>
					<Sidebar student={student}>
						<Router>
							<StatusSidebar default student={student} />

							<SearchSidebar
								path="search"
								term={params.get('term')}
								studentId={student.present.id}
								navigate={props.navigate}
							/>
						</Router>
					</Sidebar>

					<Router>
						<CourseTable default student={student.present} />

						<SemesterDetail
							student={student.present}
							path="term/:term"
						/>
					</Router>

					{params.has('share') && (
						<ShareStudentOverlay
							student={student.present}
							navigate={props.navigate}
							location={location}
						/>
					)}
				</>
			)}
		</Student>
	)
}

CourseTable.preload()
Sidebar.preload()
StudentSummary.preload()
AreaOfStudySidebar.preload()
