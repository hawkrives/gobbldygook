import {expect} from 'chai'
import findLeafRequirements from '../find-leaf-requirements'

describe('findLeafRequirements', () => {
	it('finds the leafs of a requirement tree', () => {
		const tree = {
			'name': 'Asian Studies',
			'type': 'Major',
			'revision': '2011-12',
			'$type': 'requirement',
			'result': {
				'$type': 'boolean',
				'$and': [
					{
						'$type': 'reference',
						'$requirement': 'Language',
						'_result': true,
					},
					{
						'$type': 'reference',
						'$requirement': 'Interdisciplinary',
						'_result': true,
					},
					{
						'$type': 'reference',
						'$requirement': 'Seminar',
						'_result': true,
					},
					{
						'$type': 'reference',
						'$requirement': 'Electives',
						'_result': true,
					},
				],
				'_result': true,
			},
			'Language': {
				'result': {
					'$type': 'of',
					'$count': 2,
					'$of': [
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 231 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 232 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 294 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 298 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 301 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 302 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 320 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 351 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 394 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['CHIN'], 'number': 398 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 231, 'crsid': 3 },
							'_used': true,
							'_result': true,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 232, 'crsid': 4 },
							'_used': true,
							'_result': true,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 294 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 298 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 301 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 302 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 320 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 394 },
							'_result': false,
						},
						{
							'$type': 'course',
							'$course': {'department': ['JAPAN'], 'number': 398 },
							'_result': false,
						},
					],
					'_result': true,
					'_counted': 2,
				},
				'$type': 'requirement',
				'computed': true,
			},
			'Interdisciplinary': {
				'result': {
					'$type': 'course',
					'$course': {'department': ['ASIAN'], 'number': 275, 'crsid': 5 },
					'_used': true,
					'_result': true,
				},
				'$type': 'requirement',
				'computed': true,
			},
			'Seminar': {
				'result': {
					'$type': 'boolean',
					'$or': [
						{
							'$type': 'course',
							'$course': {'department': ['ASIAN'], 'number': 397, 'crsid': 12 },
							'_used': true,
							'_result': true,
						},
						{
							'$type': 'course',
							'$course': {'department': ['ASIAN'], 'number': 399 },
						},
					],
					'_result': true,
				},
				'$type': 'requirement',
				'computed': true,
			},
			'Electives': {
				'message': 'You may not count more than four courses about any one country. At least two of the level II and III courses must be taken on-campus.',
				'Level I': {
					'result': {
						'$type': 'of',
						'$count': 2,
						'$of': [
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 121, 'crsid': 13 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 123 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 126 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 130, 'crsid': 10 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 156 },
								'_result': false,
							},
						],
						'_result': true,
						'_counted': 2,
					},
					'$type': 'requirement',
					'computed': true,
				},
				'Above I': {
					'result': {
						'$type': 'of',
						'$count': 2,
						'$of': [
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 200 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 210, 'crsid': 6 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 215, 'crsid': 7 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 216 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 220, 'crsid': 8 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 230, 'crsid': 11 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 235 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 236 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 237 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'SOAN'], 'number': 239 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 240 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'PSCI'], 'number': 245 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'HIST'], 'number': 250 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'PSCI'], 'number': 250 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'HIST'], 'number': 251 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'PHIL'], 'number': 251 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'HIST'], 'number': 252 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'HIST'], 'number': 253 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'REL'], 'number': 253 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'REL'], 'number': 254 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'REL'], 'number': 256 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'REL'], 'number': 257 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ART', 'ASIAN'], 'number': 259 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ART', 'ASIAN'], 'number': 260 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ART', 'ASIAN'], 'number': 262 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'HIST'], 'number': 262 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 268, 'crsid': 9 },
								'_used': true,
								'_result': true,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ART', 'ASIAN'], 'number': 270 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'ENVST'], 'number': 277 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'REL'], 'number': 289 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 294 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 298 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 300 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ART', 'ASIAN'], 'number': 310 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN', 'HIST'], 'number': 345 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 384 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 396 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ASIAN'], 'number': 398 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['CHIN'], 'number': 301 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['CHIN'], 'number': 302 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['CHIN'], 'number': 320 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['CHIN'], 'number': 351 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['CHIN'], 'number': 394 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['CHIN'], 'number': 398 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['JAPAN'], 'number': 301 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['JAPAN'], 'number': 302 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['JAPAN'], 'number': 320 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['JAPAN'], 'number': 394 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['JAPAN'], 'number': 398 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ECON'], 'number': 218 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['ECON'], 'number': 238 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['HIST'], 'number': 240 },
								'_result': false,
							},
							{
								'$type': 'course',
								'$course': {'department': ['PHIL'], 'number': 127 },
								'_result': false,
							},
						],
						'_result': true,
						'_counted': 5,
					},
					'$type': 'requirement',
					'computed': true,
				},
				'result': {
					'$type': 'boolean',
					'$and': [
						{
							'$type': 'modifier',
							'$count': 6,
							'$what': 'course',
							'$from': 'children',
							'$children': '$all',
							'_result': true,
							'_counted': 7,
						},
						{
							'$type': 'reference',
							'$requirement': 'Level I',
							'_result': true,
						},
						{
							'$type': 'reference',
							'$requirement': 'Above I',
							'_result': true,
						},
					],
					'_result': true,
				},
				'$type': 'requirement',
				'computed': true,
			},
			'computed': true,
		}

		expect(findLeafRequirements(tree)).to.deep.equal([
			tree,
		])
	})
})
