import React from 'react'
import {render} from 'react-dom'
import Router, {Route, DefaultRoute, Redirect} from 'react-router'

import Gobbldygook from '../screens/gobbldygook'
import AreaEditor from '../screens/area-editor'
import CourseTable from '../screens/course-table'
import CreateStudent from '../screens/create-student'
import DownloadStudent from '../screens/download-student'
import NewStudentWizard from '../screens/new-student-wizard'
import SemesterDetail from '../screens/semester-detail'
import Student from '../screens/student'
import StudentPicker from '../screens/student-picker'

// /
// /s/122932
// /s/122932?search
// /s/122932/semester/2014/fall?search=dept:NOT+dept:AMCON+dept:GCON+gened:HBS

let routes = (
	<Route handler={Gobbldygook} name='gobbldygook' path='/'>
		<DefaultRoute handler={StudentPicker} />
		<Route handler={CreateStudent} name='create-student' path='create-student/' />
		<Redirect path='s/' to='/' />
		<Redirect path='s' to='/' />
		<Redirect path='s/:id' to='s/:id/' />
		<Route handler={Student} name='student' path='s/:id/'>
			<DefaultRoute handler={CourseTable} />
			<Route handler={AreaEditor} name='area-editor' path='edit-area' />
			<Redirect path='edit-area/' to='edit-area' />
			<Route handler={NewStudentWizard} name='wizard' path='wizard/' />
			<Route handler={SemesterDetail} name='semester' path='semester/:year/:semester/' />
			<Redirect path='semester/:year/:semester' to='semester/:year/:semester/' />
			<Route handler={DownloadStudent} name='download' path='download/' />
		</Route>
	</Route>
)

// run it
console.log('3. 2.. 1... Blast off! 🚀')

Router.run(routes, (Handler, state) => {
	render(<Handler
		routerState={state}
	/>, document.getElementById('app'))
})
