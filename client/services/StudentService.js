var Fluxy = require('fluxy')
var Promise = require('bluebird')
var uuid = require('node-uuid')
var _ = require('lodash')
var mori = require('mori')

var StudentService = {
	create: function(student) {
		return new Promise(function(resolve, reject) {
			var s = {
				id: uuid.v4(),
				name: '',
				enrollment: 0,
				graduation: 0,
				creditsNeeded: 0,
				studies: StudyStore(),
				schedules: ScheduleStore(),
				// overrides: new OverrideStore(),
				// fabrications: new FabricationStore(),
			}
			resolve(mori.js_to_clj(s))
		})
	},
	encode: function(student) {

	},
	decode: function(encodedStudent) {
		// decode stuff
		var decodedStudent = encodedStudent
		this.create(decodedStudent)
	}
}

module.exports = StudentService
