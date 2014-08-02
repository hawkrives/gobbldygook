var Fluxy = require('fluxy')
var Promise = require('bluebird')
var uuid = require('node-uuid')
var _ = require('lodash')
var mori = require('mori')

function randomChar() {
	// modified from http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
	return Math.random().toString(36).slice(2, 3)
}

var ScheduleService = {
	create: function(schedule) {
		return new Promise(function(resolve, reject) {
			resolve(mori.js_to_clj({
				id: uuid.v4(),
				year: schedule.year,
				semester: schedule.semester,
				title: schedule.title || 'Schedule ' + randomChar(),
				index: schedule.index || 1,
				clbids: mori.set(),
				active: schedule.active || false,
			}))
		})
	}
}

module.exports = ScheduleService
