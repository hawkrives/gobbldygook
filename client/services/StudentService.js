var Fluxy = require('fluxy')
var Promise = require('bluebird')
var uuid = require('node-uuid')
var _ = require('lodash')
var mori = require('mori')

var StudyStore = require('../stores/StudyStore')
var ScheduleStore = require('../stores/ScheduleStore')

var StudentService = {
	create: function(student) {
		return new Promise(function(resolve, reject) {
			var s = {
				id: student.id || uuid.v4(),
				name: student.name || '',
				active: student.active || false,
				enrollment: student.enrollment || 0,
				graduation: student.graduation || 0,
				creditsNeeded: student.creditsNeeded || 0,
				studies: student.studies.length > 0 ? mori.hash_map(student.studies) : mori.hash_map(),
				schedules: student.schedules.length > 0 ? mori.hash_map(student.schedules) : mori.hash_map(),
				// overrides: new OverrideStore(),
				// fabrications: new FabricationStore(),
			}
			console.log('called StudentService.create', s)
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
