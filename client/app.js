'use strict';

var _ = require('lodash')
var Promise = require('bluebird')
var db = require('./helpers/db')
var React = require('react')
var Fluxy = require('fluxy')
var documentReady = require('./helpers/document-ready')

var Gobbldygook = require('./models/gobbldygookApp')
var loadData = require('./helpers/loadData')
var demoStudent = require('../mockups/demo_student')
var StudentActions = require('./actions/StudentActions')
window.demoStudent = demoStudent

module.exports = {
	init: function() {
		// Just for use in the browser console, I swear.
		window._ = _

		// Create the deptnum/crsid cache
		window.deptNumToCrsid = {}

		// Put a promise on document.ready
		document.ready = documentReady

		// Initialize some library options
		Promise.longStackTraces()
		React.initializeTouchEvents(true)
	},
	fluxy: function() {
		return window.db.students
			.query()
			.filter()
			.execute()
			.then(function(results) {
				var students = []
				if (results.length > 0) {
					console.log('results!', results)
					students = results
				} else {
					console.log('no results!', demoStudent)
					students = [demoStudent]
				}
				Fluxy.start()
				_.each(students, function(student) {
					StudentActions.create(student)
				})
			})
	},
	blastoff: function() {
		// Load up some global variables
		this.init()

		// Wait for document.ready and the database.
		Promise.all([db, document.ready]).bind(this).then(function() {
			console.log('3. 2.. 1... Blastoff!')

			// Load data into the database
			loadData()

			// Set up Fluxy
			return this.fluxy()
		}).then(function() {
			// Render the app
			var studentComponent = React.renderComponent(
				Gobbldygook(),
				document.body)
		}).done()
	},
}

// run it
module.exports.blastoff()
