/*global app, me, $*/
var _ = require('lodash')
var config = require('clientconfig')
var db = require('db.js')
var loadStats = require('loading-stats')
var logger = require('andlog')
var Promise = require("bluebird")
var React = require('react')
var Cortex = require('cortexjs')

var tracking = require('./helpers/metrics')
var Student = require('./models/student')

var demoStudent = require('../mockups/demo_student')
var loadData = require('./helpers/loadData')


window._ = _

function initializeLibraries() {
	Promise.longStackTraces()
	React.initializeTouchEvents(true)
}

function setupDatabase() {
	window.server = undefined;
	return db.open({
		server: 'gobbldygook',
		version: 2,
		schema: {
			courses: {
				key: { keyPath: 'clbid', autoIncrement: false },
				indexes: {
					profs:  { multiEntry: true },
					depts:  { multiEntry: true },
					places: { multiEntry: true },
					times:  { multiEntry: true },
					gereqs: { multiEntry: true },
					sourcePath: { multiEntry: true }
				}
			},
			students: {
				key: { autoIncrement: true }
			},
			areas: {
				key: { keyPath: 'sourcePath', autoIncrement: false },
				indexes: {
					type: { multiEntry: false },
					sourcePath: { multiEntry: false }
				}
			}
		}
	}).done(function(s) {
		window.server = s
	})
}

module.exports = {
	// this is the the whole app initter
	blastoff: function() {
		var self = window.app = this;
		window.times = {start: Date.now()};

		// set up some libraries
		initializeLibraries()

		// load in the demo student — for now
		window.me = new Cortex(demoStudent)
		setupDatabase().then(loadData)


		// wait for document ready to render our main view
		// this ensures the document has a body, etc.
		document.addEventListener( "DOMContentLoaded", function() {
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );

			// init our main view
			var studentComponent = React.renderComponent(
				Student(window.me),
				document.body
			)

			window.me.on('update', function(updatedStudent) {
				console.log('updated student', updatedStudent)
				studentComponent.setProps(updatedStudent)
			})

		}, false );
	},
};

// run it
module.exports.blastoff();
