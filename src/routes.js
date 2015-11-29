import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './screens/app'
// import AreaEditor from './screens/area-editor'
import CourseTable from './screens/course-table'
// import CreateStudent from './screens/create-student'
// import DownloadStudent from './screens/download-student'
// import NewStudentWizard from './screens/new-student-wizard'
// import SemesterDetail from './screens/semester-detail'
import Student from './screens/student'
import Degub from './components/degub'
import StudentPicker from './screens/student-picker'

// /
// /s/122932
// /s/122932?search
// /s/122932/semester/2014/fall?search=dept:NOT+dept:AMCON+dept:GCON+gened:HBS

export default (
	<Route component={App} path='/'>
		<IndexRoute component={StudentPicker} />
		<Route component={Degub} path='degub' />
		<Redirect from='debug' to='degub' />
		{/*<Route component={CreateStudent} path='create-student/' />*/}
		<Route component={Student} path='s/:id/'>
			{/*{<IndexRoute component={Degub} />}*/}
			<IndexRoute component={CourseTable} />
			{/*{//<Route component={AreaEditor} path='edit-area' />}
			<Route component={NewStudentWizard} path='wizard/' />
			<Route component={SemesterDetail} path='semester/:year/:semester/' />
			<Route component={DownloadStudent} path='download/' />*/}
		</Route>
	</Route>
)
