import {evaluate} from '../evaluate'

describe('evaluate', () => {
	it('evaluates!', () => {
		const area = {
			name: 'Sample Area',
			type: 'major',
			revision: '0000-01',
			result: {$type: 'reference', $requirement: 'Req'},
			Req: {
				$type: 'requirement',
				result: {
					$type: 'course',
					$course: {
						department: ['ASIAN'],
						number: 100,
					},
				},
			},
		}

		const courses = []
		const overrides = {}

		expect(() => evaluate({courses, overrides, area})).not.toThrow()

		expect(evaluate({courses, overrides, area})).toMatchInlineSnapshot(`
Object {
  "Req": Object {
    "$type": "requirement",
    "computed": false,
    "result": Object {
      "$course": Object {
        "department": Array [
          "ASIAN",
        ],
        "number": 100,
      },
      "$type": "course",
      "_checked": true,
      "_result": false,
    },
  },
  "computed": false,
  "name": "Sample Area",
  "progress": Object {
    "at": 0,
    "of": 0,
  },
  "result": Object {
    "$requirement": "Req",
    "$type": "reference",
    "_checked": true,
    "_matches": Array [],
    "_result": false,
  },
  "revision": "0000-01",
  "type": "major",
}
`)
	})
})
