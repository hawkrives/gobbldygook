// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'

import Student from '../../modules/student'

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
import {ConnectedStudentSummary as StudentSummary} from '../../modules/student/connected-student-summary'

const StatusSidebar = ({student}) => (
	<aside>
		<ConnectedSidebarToolbar
			backTo="picker"
			search={true}
			share={true}
			student={student}
		/>
		<CourseRemovalBox studentId={student.id} />
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

const TermSidebar = ({student}) => (
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
	studentId: string,
	location: {},
	navigate: string => mixed,
}) {
	let params = new URLSearchParams(location.search)

	return (
		<Student studentId={props.studentId}>
			{({student}) => (
				<>
					<Router>
						<StatusSidebar path="/" student={student} />

						<SearchSidebar
							path="/search"
							term={params.get('term')}
							student={student}
							navigate={props.navigate}
						/>

						<TermSidebar
							path="/term/:term"
							student={student}
							navigate={props.navigate}
						/>
					</Router>

					<Router>
						<CourseTable path="/" student={student.present} />

						<SemesterDetail
							student={student.present}
							path="/term/:term"
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
