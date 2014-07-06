var _ = require('lodash')

module.exports = {
	name: 'Hawken MacKay Rives',
	enrolled: 2012,
	graduation: 2016,
	studies: [
		{
			id: 'ba', type: 'degree',
			abbr: 'B.A.', title: 'Bachelor of Arts',
		},
		{
			id: 'bm', type: 'degree',
			abbr: 'B.M.', title: 'Bachelor of Music',
		},
		{
			id: 'csci', type: 'major',
			abbr: 'CSCI', title: 'Computer Science',
		},
		{
			id: 'asian', type: 'major',
			abbr: 'ASIAN', title: 'Asian Studies',
		},
		{
			id: 'japan', type: 'concentration',
			abbr: 'JAPAN', title: 'Japan Studies',
		},
		{
			id: 'math', type: 'concentration',
			abbr: 'MATH', title: 'Mathematics',
		},
	],
	schedules: [
		{
			id: 1,
			title: "Schedule 1",
			sequence: 1,
			active: true,
			year: 2012,
			semester: 1,
			clbids: [123456, 123459, 123457, 123458]
		},
		{
			id: 2,
			title: "Schedule 2",
			sequence: 2,
			year: 2012,
			semester: 1,
			clbids: [123456, 123459, 123460, 123458]
		},
	],

	overrides: [
		{
			what: 'credits',
			with: 1
		}
	],

	// derived
	degrees: function() {
		return _.filter(this.studies, {kind: 'degree'});
	},
	majors: function() {
		return _.filter(this.studies, {kind: 'major'});
	},
	concentrations: function() {
		return _.filter(this.studies, {kind: 'concentration'});
	},
	clbids: function() {
		var activeSchedules = _.filter(this.schedules, 'active')
		var clbids = _.pluck(activeSchedules, 'clbids')
		return _.flatten(clbids)
	}
}
