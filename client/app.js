/*global app, me, $*/
var _ = require('lodash')
var logger = require('andlog')
var config = require('clientconfig')
var React = require('react')

var tracking = require('./helpers/metrics')
var Student = require('./models/student')
var loadStats = require('loading-stats')
var demoStudent = require('../mockups/demo_student')

module.exports = {
	// this is the the whole app initter
	blastoff: function() {
		var self = window.app = this;
		window.times = {start: Date.now()};

		// create an empty collection for our students.
		window.me = demoStudent

		// init our URL handlers and the history tracker
		// this.router = new Router();

		// wait for document ready to render our main view
		// this ensures the document has a body, etc.
		document.addEventListener( "DOMContentLoaded", function() {
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );

			// init our main view
			React.renderComponent(
				Student({
					moniker: me.name,
					studies: me.studies,
					schedules: me.schedules
				}),
				document.body
			)

			// listen for new pages from the router
			// self.router.on('newPage', mainView.setPage, mainView);

			// we have what we need, we can now start our router and show the appropriate page
			// self.router.history.start({pushState: true, root: '/'});
		}, false );
	},

	// This is how you navigate around the app. this gets called by a global
	// click handler that handles all the <a> tags in the app. it expects a
	// url without a leading slash.
	// for example: "costello/settings".

	// navigate: function(page) {
	//     var url = (page.charAt(0) === '/') ? page.slice(1) : page;
	//     this.router.history.navigate(url, {trigger: true});
	// }
};

// run it
module.exports.blastoff();
