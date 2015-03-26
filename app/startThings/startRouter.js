import React from 'react'
import Router from 'react-router'
import {Route, DefaultRoute} from 'react-router'

import Gobbldygook from '../elements/app'
import StudentList from '../elements/studentList'
import Student from '../elements/student'
import AddStudent from '../elements/student'
import CourseTable from '../elements/courseTable'
import SemesterDetail from '../elements/semesterDetail'

// /
// /s/122932
// /s/122932?search
// /s/122932/semester/2014/fall?search=dept:NOT+dept:AMCON+dept:GCON+gened:HBS

let routes = (
	<Route handler={Gobbldygook} name='gobbldygook' path='/'>
		<DefaultRoute handler={StudentList} />
		<Route handler={AddStudent} name='add-student' path='add-student/' />
		<Route handler={Student} name='student' path='s/:id/'>
			<DefaultRoute handler={CourseTable} />
			<Route handler={SemesterDetail} name='semester' path='semester/:year/:semester/' />
		</Route>
	</Route>
)

// run it
console.log('3. 2.. 1... Blastoff!')

/*eslint-disable no-unused-vars */
Router.run(routes, (Handler) => React.render(<Handler />, document.querySelector('.app')))
/*eslint-enable no-unused-vars */
