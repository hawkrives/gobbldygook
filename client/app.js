/*global app, me, $*/
var _ = require('lodash')
var Promise = require('bluebird')
var db = require('./helpers/db')

var React = require('react')
var Cortex = require('cortexjs')

var Student = require('./models/student')
var NotificationContainer = require('./models/toast').NotificationContainer

var demoStudent = require('../mockups/demo_student')
var loadData = require('./helpers/loadData')

window._ = _

function initializeLibraries() {
	Promise.longStackTraces()
	React.initializeTouchEvents(true)
}

function loadStudent() {
	console.log('loading student')
	return new Promise(function(resolve, reject) {
		resolve(new Cortex(demoStudent))
	})
}

document.ready = new Promise(function(resolve) {
	if (document.readyState === 'complete') {
		resolve()
	} else {
		function onReady() {
			resolve()
			document.removeEventListener('DOMContentLoaded', onReady, true)
			window.removeEventListener('load', onReady, true)
		}
		document.addEventListener('DOMContentLoaded', onReady, true)
		window.addEventListener('load', onReady, true)
	}
})

module.exports = {
	// this is the the whole app initter
	blastoff: function() {
		window.times = {start: Date.now()}

		// set up some libraries
		initializeLibraries()

		// load in the demo student — for now
		var studentPromise = loadStudent()
			.then(function(student) {
				window.me = student
			})

		window.notifications = new Cortex([])

		// Load data into the database
		var databasePromise = db.isReady
		databasePromise.then(function() {
			console.log('database ready')
		})

		var dataLoadedPromise = databasePromise.then(loadData)
		dataLoadedPromise.then(function() {
			console.log('data loaded')
		})

		// Wait for document.ready, the database, and the student.
		Promise.all([
			databasePromise,
			document.ready,
			studentPromise
		]).then(function() {
			console.log('3. 2.. 1... Blastoff!')

			var studentElement = document.createElement('div')
			studentElement.id = 'student'
			document.body.appendChild(studentElement)

			// init our main view
			var studentComponent = React.renderComponent(
				Student(window.me),
				document.getElementById('student')
			)

			window.me.on('update', function(updatedStudent) {
				console.log('updated student', updatedStudent)
				studentComponent.setProps(updatedStudent)
			})

			var notificationsElement = document.createElement('div')
			notificationsElement.id = 'notifications'
			document.body.appendChild(notificationsElement)

			var notifications = React.renderComponent(
				NotificationContainer(window.notifications),
				document.getElementById('notifications')
			)

			window.notifications.on('update', function(updatedNotifications) {
				console.log('updated notifications', updatedNotifications.val())
				notifications.setProps({notifications: updatedNotifications})
			})
		})
	},
};

// run it
module.exports.blastoff();
