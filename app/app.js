'use strict';

var _ = require('lodash')
var Promise = require('bluebird')
var db = require('./helpers/db')
var React = require('react')
var Fluxxor = require('fluxxor')
var documentReady = require('./helpers/document-ready')

var Gobbldygook = require('./models/gobbldygookApp')
var loadData = require('./helpers/loadData')
var demoStudent = require('../mockups/demo_student.json')

var actions = require('./actions/StudentActions')
var StudentStore = require('./stores/StudentStore')

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

function setupStudents() {
	return db.store('students').all()
		.then(function(results) {
			if (results.length > 0) {
				console.log('results!', results)
			} else {
				console.log('no results!')
				addDemoStudent()
			}

			var students = (results.length > 0) ? results : [demoStudent]
			var stores = {StudentStore: new StudentStore({students: students})}
			return new Fluxxor.Flux(stores, actions)
		})
}

function blastoff() {
	// Wait for document.ready and the database.
	Promise.all([db, document.ready]).then(function() {
		console.log('3. 2.. 1... Blastoff!')

		// Load data into the database
		loadData()

		// Set up Fluxxor
		return setupStudents()
	}).then(function(fluxxor) {
		// Render the app
		var studentComponent = React.renderComponent(
			Gobbldygook({flux: fluxxor}),
			document.body
		)
	}).done()
}

// run it
blastoff()

export default blastoff
