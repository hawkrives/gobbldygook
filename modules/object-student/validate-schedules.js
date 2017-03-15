'use strict'

const mapValues = require('lodash/mapValues')
const { validateSchedule } = require('./validate-schedule')

function validateSchedules(student) {
	return new Promise(resolve => {
		let { schedules } = student
		schedules = mapValues(schedules, validateSchedule)
		resolve(Object.assign({}, student, { schedules }))
	})
}

module.exports.validateSchedules = validateSchedules
