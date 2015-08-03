import React from 'react'
import Router, {Route, DefaultRoute} from 'react-router'

import Gobbldygook from '../elements/app'
import StudentPicker from '../elements/student-picker'
import Student from '../elements/student'
import CreateStudent from '../elements/create-student'
import NewStudentWizard from '../elements/new-student-wizard'
import CourseTable from '../elements/courseTable'
import SemesterDetail from '../elements/semesterDetail'
import DownloadStudent from '../elements/download-student'

// /
// /s/122932
// /s/122932?search
// /s/122932/semester/2014/fall?search=dept:NOT+dept:AMCON+dept:GCON+gened:HBS

let routes = (
	<Route handler={Gobbldygook} name='gobbldygook' path='/'>
		<DefaultRoute handler={StudentPicker} />
		<Route handler={CreateStudent} name='create-student' path='create-student/' />
		<Route handler={Student} name='student' path='s/:id/'>
			<DefaultRoute handler={CourseTable} />
			<Route handler={NewStudentWizard} name='wizard' path='wizard/' />
			<Route handler={SemesterDetail} name='semester' path='semester/:year/:semester/' />
			<Route handler={DownloadStudent} name='download' path='download/' />
		</Route>
	</Route>
)

// run it
console.log('3. 2.. 1... Blast off! 🚀')

Router.run(routes, (Handler, state) => {
	React.render(<Handler routerState={state} />, document.getElementById('app'))
})
