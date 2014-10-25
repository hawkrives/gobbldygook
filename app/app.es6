'use strict';

require('./styles/app.scss')

import * as _ from 'lodash'
import * as React from 'react'
import * as Promise from 'bluebird'

import {db} from './helpers/db'
import documentReady from './helpers/document-ready'

import Gobbldygook from './models/gobbldygookApp'
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
	Promise.all([db, documentReady]).then(function() {
		console.log('3. 2.. 1... Blastoff!')

		 // Load data into the database, then render the app
		loadData().then(() => {
			render()
			emitter.on('change', render)
		})
	}).done()
}

// run it
blastoff()

export default blastoff
