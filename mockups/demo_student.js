module.exports = {
	name: 'Hawken MacKay Rives',
	enrolled: 2012,
	graduation: 2016,

	creditsNeeded: 35,

	studies: [
		{
			id: 'd-ba', type: 'degree',
			abbr: 'B.A.', title: 'Bachelor of Arts',
		},
		{
			id: 'd-bm', type: 'degree',
			abbr: 'B.M.', title: 'Bachelor of Music',
		},
		{
			id: 'm-chmus', type: 'major',
			abbr: 'CHMUS', title: 'Church Music',
		},
		{
			id: 'm-csci', type: 'major',
			abbr: 'CSCI', title: 'Computer Science',
		},
		{
			id: 'm-asian', type: 'major',
			abbr: 'ASIAN', title: 'Asian Studies',
		},
		{
			id: 'm-japan', type: 'concentration',
			abbr: 'JAPAN', title: 'Japan Studies',
		},
		{
			id: 'm-math', type: 'concentration',
			abbr: 'MATH', title: 'Mathematics',
		},
		{
			id: 'm-management', type: 'emphasis',
			abbr: 'MGMT', title: 'Management',
		}
	],

	schedules: [
		{
			id: 1, year: 2012, semester: 1,
			title: 'Schedule 1', sequence: 1,
			clbids: [82908, 82768, 82792, 83505],
			active: true,
		},
		{
			id: 2, year: 2012, semester: 2,
			title: 'Schedule 1', sequence: 1,
			clbids: [85898],
			active: true,
		},
		{
			id: 3, year: 2012, semester: 3,
			title: 'Schedule 1', sequence: 1,
			clbids: [84512, 84461, 84378, 85991, 90802],
			active: true,
		},
		{
			id: 4, year: 2013, semester: 1,
			title: 'Schedule 1', sequence: 1,
			clbids: [89090, 88273, 88681, 88593, 88630],
			active: true,
		},
		{
			id: 5, year: 2013, semester: 2,
			title: 'Schedule 1', sequence: 1,
			clbids: [89466],
			active: true,
		},
		{
			id: 6, year: 2013, semester: 3,
			title: 'Schedule 1', sequence: 1,
			clbids: [90719, 89957, 90339, 90172],
			active: true,
		},
		{
			id: 7, year: 2014, semester: 1,
			title: 'Schedule 1', sequence: 1,
			clbids: [97217, 97120, 97119, 97125],
			active: true,
		},
		{
			id: 8, year: 2014, semester: 2,
			title: 'Schedule 1', sequence: 1,
			clbids: [97261],
			active: true,
		},
		{
			id: 9, year: 2014, semester: 2,
			title: 'Schedule 2', sequence: 2,
			clbids: [97174],
			active: false,
		},
		{
			id: 10, year: 2014, semester: 3,
			title: 'Schedule 1', sequence: 1,
			clbids: [95594, 95842],
			active: true,
		},
		{
			id: 11, year: 2015, semester: 1,
			title: 'Schedule 1', sequence: 1,
			clbids: [92908, 97122],
			active: true,
		},
		{
			id: 12, year: 2015, semester: 2,
			title: 'Schedule 1', sequence: 1,
			clbids: [],
			active: true,
		},
		{
			id: 13, year: 2015, semester: 3,
			title: 'Schedule 1', sequence: 1,
			clbids: [91746, 96980],
			active: true,
		},
		{
			id: 14, year: 2012, semester: 1,
			title: 'Schedule 2', sequence: 2,
			clbids: [12346, 12459, 13460, 17358],
		},
	],

	overrides: [
		{
			what: 'credits',
			with: 1
		}
	]
}
