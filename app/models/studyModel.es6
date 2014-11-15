'use strict';

import {Emitter} from 'event-kit'
import events from '../helpers/events.es6'

class Study {
	constructor(areaOfStudy={}) {
		this.id = areaOfStudy.id || ''
		this.type = areaOfStudy.type || ''
		this.abbr = areaOfStudy.abbr || ''
		this.title = areaOfStudy.title || ''
		this.index = areaOfStudy.index || 0

		this._emitter = new Emitter;
	}


	// EventEmitter helpers

	_emitChange() {
		this._emitter.emit(events.didChange)
	}

	onDidChange(callback) {
		return this._emitter.on(events.didChange, callback)
	}


	// Lifecycle Functions

	destroy() {
		this._emitter.dispose()
	}


	// AreaOfStudy Maintenance

	reorder(newIndex) {
		this.index = newIndex
		this._emitChange()
	}
}

export default Study
