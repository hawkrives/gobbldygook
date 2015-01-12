import '6to5-core/polyfill'
import 'fetch'

import Promise from 'bluebird'
Promise.longStackTraces()

import errorActions from './flux/errorActions'
import errorStore from './flux/errorStore'
window.addEventListener('error', errorActions.logError)

import Router from 'react-router'

import './helpers/db'
import './helpers/bindKeys'

// Just for use in the browser console, I swear.
import _ from 'lodash'
window.lodash = _

// Stick React where I (and the Chrome devtools)
// [ok, mostly for the devtools] can see it.
import React from 'react'
window.React = React
React.initializeTouchEvents(true)

// Handy debugging function
window.log = (...args) => console.log(...args)

import loadData from './helpers/loadData'
loadData()

import Gobbldygook from './elements/app'
import StudentList from './elements/studentList'
import Student from './elements/student'
import AddStudent from './elements/student'
import CourseTable from './elements/courseTable'
import SemesterDetail from './elements/semesterDetail'

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

Router.run(routes, (Handler) => React.render(React.createElement(Handler), document.body))
