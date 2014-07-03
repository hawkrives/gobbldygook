{
	name: 'Hawken MacKay Rives',
	enrolled: 2012,
	graduation: 2016,
	studies: [
		{
			id: 'ba',
			type: 'degree',
			title: 'Bachelor of Arts',
		},
		{
			id: 'bm',
			type: 'degree',
			title: 'Bachelor of Music',
		},
		{
			id: 'csci',
			type: 'major',
			title: 'Computer Science',
		},
		{
			id: 'asian',
			type: 'major',
			title: 'Asian Studies',
		},
		{
			id: 'japan',
			type: 'concentration',
			title: 'Japan Studies',
		},
		{
			id: 'math',
			type: 'concentration',
			title: 'Mathematics',
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

		}
	],

	// derived
	get degrees: function() {
        return _.filter(this.studies, {kind: 'degree'});
    },
    get majors: function() {
        return _.filter(this.studies, {kind: 'major'});
    },
    get concentrations: function() {
        return _.filter(this.studies, {kind: 'concentration'});
    },
    get clbids: function() {
        var chosenSchedules = _.filter(this.schedules, 'chosen')
        var courses = _.pluck(chosenSchedules, 'clbids')
        return _.flatten(courses)
    }
}
