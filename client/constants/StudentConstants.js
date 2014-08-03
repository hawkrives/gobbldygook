'use strict';

var Fluxy = require('fluxy')

var StudentConstants = Fluxy.createConstants({
	serviceMessages: [
		'STUDENT_ENCODE',
		'STUDENT_DECODE',
		'STUDENT_UPDATE',
		'STUDENT_CREATE',
		'STUDENT_DESTROY',
		'STUDENT_UNDO',
		'STUDENT_TOGGLE_ACTIVE',
		'STUDENT_SAVE',
	],
	messages: [
		'STUDENT_CHANGED',
	]
})

module.exports = StudentConstants
