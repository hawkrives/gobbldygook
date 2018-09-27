import findLeafRequirements from '../find-leaf-requirements'
import compute from '../compute'

describe('findLeafRequirements', () => {
	it('finds the leafs of a requirement tree', () => {
		const tree = compute({
			name: 'Asian Studies',
			type: 'Major',
			revision: '2011-12',
			result: {
				$type: 'boolean',
				$booleanType: 'and',
				$and: [
					{
						$type: 'reference',
						$requirement: 'Language',
					},
					{
						$type: 'reference',
						$requirement: 'Interdisciplinary',
					},
					{
						$type: 'reference',
						$requirement: 'Seminar',
					},
					{
						$type: 'reference',
						$requirement: 'Electives',
					},
				],
			},
			Language: {
				result: {
					$type: 'of',
					$count: {
						$operator: '$gte',
						$num: 2,
					},
					$of: [
						{
							$type: 'course',
							department: 'CHIN',
							number: 231,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 232,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 294,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 298,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 301,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 302,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 320,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 351,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 394,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 398,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 231,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 232,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 294,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 298,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 301,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 302,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 320,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 394,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 398,
						},
					],
				},
				$type: 'requirement',
			},
			Interdisciplinary: {
				result: {
					$type: 'course',
					department: 'ASIAN',
					number: 275,
				},
				$type: 'requirement',
			},
			Seminar: {
				result: {
					$type: 'boolean',
					$booleanType: 'or',
					$or: [
						{
							$type: 'course',
							department: 'ASIAN',
							number: 397,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 399,
						},
					],
				},
				$type: 'requirement',
			},
			Electives: {
				message:
					'You may not count more than four courses about any one country. At least two of the level II and III courses must be taken on-campus.',
				filter: {
					$of: [
						{
							$type: 'course',
							department: 'ASIAN',
							number: 121,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 123,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 126,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 130,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 156,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 200,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 210,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 215,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 216,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 220,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 230,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 235,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 236,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 237,
						},
						{
							$type: 'course',
							department: 'AS/SA',
							number: 239,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 240,
						},
						{
							$type: 'course',
							department: 'AS/PS',
							number: 245,
						},
						{
							$type: 'course',
							department: 'AS/HI',
							number: 250,
						},
						{
							$type: 'course',
							department: 'AS/PS',
							number: 250,
						},
						{
							$type: 'course',
							department: 'AS/HI',
							number: 251,
						},
						{
							$type: 'course',
							department: 'AS/PH',
							number: 251,
						},
						{
							$type: 'course',
							department: 'AS/HI',
							number: 252,
						},
						{
							$type: 'course',
							department: 'AS/HI',
							number: 253,
						},
						{
							$type: 'course',
							department: 'AS/RE',
							number: 253,
						},
						{
							$type: 'course',
							department: 'AS/RE',
							number: 254,
						},
						{
							$type: 'course',
							department: 'AS/RE',
							number: 256,
						},
						{
							$type: 'course',
							department: 'AS/RE',
							number: 257,
						},
						{
							$type: 'course',
							department: 'AR/AS',
							number: 259,
						},
						{
							$type: 'course',
							department: 'AR/AS',
							number: 260,
						},
						{
							$type: 'course',
							department: 'AR/AS',
							number: 262,
						},
						{
							$type: 'course',
							department: 'AS/HI',
							number: 262,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 268,
						},
						{
							$type: 'course',
							department: 'AR/AS',
							number: 270,
						},
						{
							$type: 'course',
							department: 'AS/ES',
							number: 277,
						},
						{
							$type: 'course',
							department: 'AS/RE',
							number: 289,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 294,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 298,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 300,
						},
						{
							$type: 'course',
							department: 'AR/AS',
							number: 310,
						},
						{
							$type: 'course',
							department: 'AS/HI',
							number: 345,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 384,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 396,
						},
						{
							$type: 'course',
							department: 'ASIAN',
							number: 398,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 301,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 302,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 320,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 351,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 394,
						},
						{
							$type: 'course',
							department: 'CHIN',
							number: 398,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 301,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 302,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 320,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 394,
						},
						{
							$type: 'course',
							department: 'JAPAN',
							number: 398,
						},
						{
							$type: 'course',
							department: 'ECON',
							number: 218,
						},
						{
							$type: 'course',
							department: 'ECON',
							number: 238,
						},
						{
							$type: 'course',
							department: 'HIST',
							number: 240,
						},
						{
							$type: 'course',
							department: 'PHIL',
							number: 127,
						},
					],
					$filterType: 'of',
					$distinct: false,
					$type: 'filter',
				},
				result: {
					$type: 'boolean',
					$booleanType: 'and',
					$and: [
						{
							$from: 'filter',
							$type: 'modifier',
							$count: {
								$operator: '$gte',
								$num: 6,
							},
							$what: 'course',
						},
						{
							$from: 'filter-where',
							$where: {
								$type: 'qualification',
								$key: 'level',
								$operator: '$eq',
								$value: 100,
							},
							$type: 'modifier',
							$count: {
								$operator: '$lte',
								$num: 2,
							},
							$what: 'course',
						},
					],
				},
				$type: 'requirement',
			},
			$type: 'requirement',
			slug: 'asian-studies',
		}, {
			path: [],
			courses: [
				{department: 'JAPAN', number: 231},
				{department: 'JAPAN', number: 232},
				{department: 'ASIAN', number: 275},
				{department: 'ASIAN', number: 397},
				{department: 'ASIAN', number: 121},
				{department: 'ASIAN', number: 130},
				{department: 'ASIAN', number: 210},
				{department: 'ASIAN', number: 215},
				{department: 'ASIAN', number: 220},
				{department: 'ASIAN', number: 230},
				{department: 'ASIAN', number: 268},
			]
		})

		expect(tree).toMatchSnapshot()

		expect(findLeafRequirements(tree)).toEqual([tree])
	})
})
