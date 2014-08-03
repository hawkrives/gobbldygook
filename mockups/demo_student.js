'use strict';

module.exports = {
	id: '3AE9E7EE-DA8F-4014-B987-8D88814BB848',

	name: 'Hawken MacKay Rives',
	enrollment: 2012,
	graduation: 2016,

	creditsNeeded: 35,
	active: true,

	studies: {
		'd-ba': {
			id: 'd-ba', type: 'degree',
			abbr: 'B.A.', title: 'Bachelor of Arts',
		},
		'd-bm': {
			id: 'd-bm', type: 'degree',
			abbr: 'B.M.', title: 'Bachelor of Music',
		},
		'm-chmus': {
			id: 'm-chmus', type: 'major',
			abbr: 'CHMUS', title: 'Church Music',
		},
		'm-csci': {
			id: 'm-csci', type: 'major',
			abbr: 'CSCI', title: 'Computer Science',
		},
		'm-asian': {
			id: 'm-asian', type: 'major',
			abbr: 'ASIAN', title: 'Asian Studies',
		},
		'm-japan': {
			id: 'm-japan', type: 'concentration',
			abbr: 'JAPAN', title: 'Japan Studies',
		},
		'm-math': {
			id: 'm-math', type: 'concentration',
			abbr: 'MATH', title: 'Mathematics',
		},
		'm-management': {
			id: 'm-management', type: 'emphasis',
			abbr: 'MGMT', title: 'Management',
		}
	},

	schedules: {
		1: {
			id: 1, year: 2012, semester: 1,
			title: 'Schedule 1', index: 1,
			clbids: [82908, 82768, 82792, 83505],
			active: true,
		},
		2: {
			id: 2, year: 2012, semester: 2,
			title: 'Schedule 1', index: 1,
			clbids: [85898],
			active: true,
		},
		3: {
			id: 3, year: 2012, semester: 3,
			title: 'Schedule 1', index: 1,
			clbids: [84512, 84461, 84378, 85991, 90802],
			active: true,
		},
		4: {
			id: 4, year: 2013, semester: 1,
			title: 'Schedule 1', index: 1,
			clbids: [89090, 88273, 88681, 88593, 88630],
			active: true,
		},
		5: {
			id: 5, year: 2013, semester: 2,
			title: 'Schedule 1', index: 1,
			clbids: [89466],
			active: true,
		},
		6: {
			id: 6, year: 2013, semester: 3,
			title: 'Schedule 1', index: 1,
			clbids: [90719, 89957, 90339, 90172],
			active: true,
		},
		7: {
			id: 7, year: 2014, semester: 1,
			title: 'Schedule 1', index: 1,
			clbids: [97217, 97120, 97119, 97125, 94208],
			active: true,
		},
		8: {
			id: 8, year: 2014, semester: 2,
			title: 'Schedule 1', index: 1,
			clbids: [97261],
			active: true,
		},
		9: {
			id: 9, year: 2014, semester: 2,
			title: 'Schedule 2', index: 2,
			clbids: [97174],
			active: false,
		},
		10: {
			id: 10, year: 2014, semester: 3,
			title: 'Schedule 1', index: 1,
			clbids: [95594, 95842],
			active: true,
		},
		11: {
			id: 11, year: 2015, semester: 1,
			title: 'Schedule 1', index: 1,
			clbids: [92908, 97122],
			active: true,
		},
		12: {
			id: 12, year: 2015, semester: 2,
			title: 'Schedule 1', index: 1,
			clbids: [],
			active: true,
		},
		13: {
			id: 13, year: 2015, semester: 3,
			title: 'Schedule 1', index: 1,
			clbids: [91746, 96980],
			active: true,
		},
		14: {
			id: 14, year: 2012, semester: 1,
			title: 'Schedule 2', index: 2,
			clbids: [12346, 12459, 13460, 17358],
		},
	},

	overrides: [
		{
			what: 'credits',
			with: 1
		}
	]
}
