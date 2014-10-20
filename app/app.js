'use strict';

import * as _ from 'lodash'
import * as Promise from 'bluebird'
import * as React from 'react'
import * as Reflux from 'fluxxor'
import db from './helpers/db'
import documentReady from './helpers/document-ready'

import Gobbldygook from './models/gobbldygookApp'
import loadData from './helpers/loadData'
import * as demoStudent from '../mockups/demo_student.json'

// Just for use in the browser console, I swear.
window.lodash = _

// Stick React where I (and the Chrome devtools) can see it.
window.React = React

// Handy debugging function
window.log = (thing) => console.log(_.isUndefined(thing) ? arguments : thing)

// Initialize some library options.
Promise.longStackTraces()
React.initializeTouchEvents(true)

function addDemoStudent() {
	return db.store('students').put(demoStudent);
}

// function setupStudents() {
// 	return db.store('students').all()
// 		.then(function(results) {
// 			if (results.length > 0) {
// 				console.log('results!', results)
// 			} else {
// 				console.log('no results!')
// 				addDemoStudent()
// 			}

// 			var students = (results.length > 0) ? results : [demoStudent]
// 			var stores = {StudentStore: new StudentStore({students: students})}
// 			return new Fluxxor.Flux(stores, actions)
// 		})
// }

function blastoff() {
	// Wait for document.ready and the database.
	Promise.all([db, document.ready]).then(function() {
		console.log('3. 2.. 1... Blastoff!')

		// Load data into the database
		// loadData()

		return Promise.resolve(true);
		// Set up Fluxxor
		// return setupStudents()
	}).then(function() {
		// Render the app
		var studentComponent = React.renderComponent(
			Gobbldygook(),
			document.body
		)
	}).done()
}

// run it
blastoff()

export default blastoff
