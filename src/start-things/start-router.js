import React from 'react'
import Router, {Route, IndexRoute, Redirect} from 'react-router'
import createHistory from 'history/lib/createHashHistory'
const history = createHistory({
	queryKey: false,
})

import Gobbldygook from '../screens/gobbldygook'
import AreaEditor from '../screens/area-editor'
import CourseTable from '../screens/course-table'
import CreateStudent from '../screens/create-student'
import DownloadStudent from '../screens/download-student'
import NewStudentWizard from '../screens/new-student-wizard'
import SemesterDetail from '../screens/semester-detail'
import Student from '../screens/student'
import StudentPicker from '../screens/student-picker'

const routes = (
	<Router history={history}>
		<Route path='/' component={Gobbldygook}>
			<IndexRoute component={StudentPicker} />

			<Route path='create-student/' component={CreateStudent} />

			<Route path='s/:id' component={Student}>
				<IndexRoute component={CourseTable} />
				<Route path='edit-area' component={AreaEditor} />
				<Redirect from='edit-area/' to='edit-area' />
				<Route path='wizard/' component={NewStudentWizard} />
				<Route path='semester/:year/:semester' component={SemesterDetail} />
				<Route path='download/' component={DownloadStudent} />
			</Route>
		</Route>
	</Router>
)

export default routes
