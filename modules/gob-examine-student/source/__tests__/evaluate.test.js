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
  "$type": "computation-result",
  "computed": false,
  "details": Object {
    "Req": Object {
      "$type": "computation-result",
      "computed": false,
      "details": Object {
        "$type": "requirement",
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
    },
    "name": "Sample Area",
    "result": Object {
      "$requirement": "Req",
      "$type": "reference",
      "_checked": true,
      "_result": false,
    },
    "revision": "0000-01",
    "type": "major",
  },
  "progress": Object {
    "at": 0,
    "of": 0,
  },
}
`)
	})
})
