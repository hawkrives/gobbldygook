/*global app, me, $*/
var _ = require('lodash')
var Promise = require('bluebird')
var db = require('./helpers/db')
var React = require('react')
var Cortex = require('cortexjs')

var Student = require('./models/student')
var NotificationContainer = require('./models/toast').NotificationContainer

var loadData = require('./helpers/loadData')

var demoStudent = require('../mockups/demo_student')

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

function createEl(tag, attrs) {
	var element = document.createElement(tag)
	element.id = attrs.id
	return element
}

function logDatabaseReady(server) {
	console.log('database ready')
}
function logDataLoaded() {
	console.log('data loaded')
}

module.exports = {
	// this is the the whole app initter
	blastoff: function() {
		window.times = {start: Date.now()}

		// set up some libraries
		initializeLibraries()

		// load in the demo student — for now
		var studentPromise = loadStudent().then(function(student) {
			window.me = student
		}).done()

		window.notifications = new Cortex([])

		// Prepare the database
		db.then(logDatabaseReady)

		// Load data into the database
		db.then(loadData).then(logDataLoaded).done()

		document.ready.then(function() {
			document.body.appendChild(createEl('div', {id: 'notifications'}))
			document.body.appendChild(createEl('div', {id: 'student'}))
		})

		// Wait for document.ready, the database, and the student.
		Promise.all([db, document.ready, studentPromise]).then(function() {
			console.log('3. 2.. 1... Blastoff!')

			var notifications = React.renderComponent(
				NotificationContainer(window.notifications),
				document.getElementById('notifications'))

			window.notifications.on('update', function(updatedNotifications) {
				notifications.setProps({notifications: updatedNotifications})
			})

			document.body.appendChild(createEl('div', {id: 'student'}))
			var studentComponent = React.renderComponent(
				Student({student: window.me}),
				document.getElementById('student'))

			window.me.on('update', function(updatedStudent) {
				studentComponent.setProps(updatedStudent)
			})
		}).done()
	},
};

// run it
module.exports.blastoff();
