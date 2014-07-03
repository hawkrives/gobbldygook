var _ = require('lodash')
var AmpersandModel = require('ampersand-model')


module.exports = AmpersandModel.extend({
	props: {
		clbid: ['number', true, 0],
		yearTaken: ['number', true, 1874],
		semesterTaken: ['number', true, 0]
	},
	derived: {
		details: {
			deps: ['clbid'],
			cache: true,
			fn: function() {
				return getCourse(this.clbid)
			}
		}
	}
})