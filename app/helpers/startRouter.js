import React from 'react'
import Router from 'react-router'

import Gobbldygook from 'app/elements/app'
import StudentList from 'app/elements/studentList'
import Student from 'app/elements/student'
import AddStudent from 'app/elements/student'
import CourseTable from 'app/elements/courseTable'
import SemesterDetail from 'app/elements/semesterDetail'

let Route = React.createFactory(Router.Route)
let DefaultRoute = React.createFactory(Router.DefaultRoute)

// /
// /s/122932
// /s/122932?search
// /s/122932/semester/2014/fall?search=dept:NOT+dept:AMCON+dept:GCON+gened:HBS

let routes = (
	Route({handler: Gobbldygook, name: 'gobbldygook', path: '/'},
		DefaultRoute({handler: StudentList}),
		Route({handler: AddStudent, name: 'add-student', path: 'add-student/'}),
		Route({handler: Student, name: 'student', path: 's/:id/'},
			DefaultRoute({handler: CourseTable}),
			Route({handler: SemesterDetail, name: 'semester', path: 'semester/:year/:semester/'}))
	)
)

// run it
console.log('3. 2.. 1... Blastoff!')

Router.run(routes, (Handler) => React.render(React.createElement(Handler), document.querySelector('.app')))
