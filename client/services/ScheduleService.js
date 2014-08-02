var Fluxy = require('fluxy')
var Promise = require('bluebird')
var uuid = require('node-uuid')
var _ = require('lodash')

var ScheduleService = {
	create: function(schedule) {
		return new Promise(function(resolve, reject) {
			resolve(_.merge({id: uuid.v4()}, schedule))
		})
	}
}

module.exports = ScheduleService
