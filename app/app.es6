'use strict';

import * as _ from 'lodash'
import * as React from 'react'
React.initializeTouchEvents(true)
import * as Promise from 'bluebird'
Promise.longStackTraces()

import db from './helpers/db.es6'
import documentReady from './helpers/document-ready.es6'

import Gobbldygook from './elements/gobbldygookApp.es6'
import loadData from './helpers/loadData.es6'
import svgSpinner from './svg-spinner.es6'

import 'es6-shim'

// Just for use in the browser console, I swear.
window.lodash = _

// Stick React where I (and the Chrome devtools)
// [ok, mostly for the devtools] can see it.
window.React = React

// Handy debugging function
window.log = (thing) => console.log(_.isUndefined(thing) ? arguments : thing)

let render = () => React.render(React.createElement(Gobbldygook, null), document.body)

let blastoff = () => {
	document.title = 'Gobbldygook Schedule Playground'

	// Wait for document.ready and the database.
	Promise.all([db, documentReady]).then(() => {
		console.log('3. 2.. 1... Blastoff!')

		document.body.innerHTML = '<div class="loading">' + svgSpinner + '</div>'

		// Load data into the database, then render the app
		loadData().then(() => {
			render()
			console.log('done')
		})
	})
}

// run it
blastoff()

export default blastoff
