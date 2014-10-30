'use strict';

import * as _ from 'lodash'
import * as React from 'react'
import * as Promise from 'bluebird'

import db from './helpers/db'
import documentReady from './helpers/document-ready'

import Gobbldygook from './elements/gobbldygookApp'
import loadData from './helpers/loadData'
import emitter from './helpers/emitter'

import 'es6-shim'

// Just for use in the browser console, I swear.
window.lodash = _

// Stick React where I (and the Chrome devtools)
// [ok, mostly for the devtools] can see it.
window.React = React

// Handy debugging function
window.log = (thing) => console.log(_.isUndefined(thing) ? arguments : thing)

React.initializeTouchEvents(true)
Promise.longStackTraces()

let render = () => React.renderComponent(Gobbldygook(), document.body)

let blastoff = () => {
	// Wait for document.ready and the database.
	Promise.all([db, documentReady]).then(() => {
		console.log('3. 2.. 1... Blastoff!')

		document.body.innerHTML = "<div class='loading ion-loading-c'></div>"

		// Load data into the database, then render the app
		loadData().then(() => {
			render()
			emitter.on('change', render)
			console.log('done')
		})
	})
}

// run it
blastoff()

export default blastoff
