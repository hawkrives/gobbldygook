// @flow

import {enhanceHanson, enhanceHansonRequirement} from '../enhance-hanson'

const basicFile = () => ({
	name: 'test',
	type: 'test',
	revision: 'test',
	requirements: {},
	result: 'CSCI 121',
})

describe('enhanceHanson', () => {
	it('adds a "slug" key to the top-level', () => {
		const actual = enhanceHanson({
			name: 'test',
			type: 'test',
			revision: 'test',
			requirements: {},
			result: 'CSCI 121',
		})

		expect(actual).toMatchInlineSnapshot(`
Object {
  "name": "test",
  "requirements": Object {},
  "result": Object {
    "$type": "course",
    "department": "CSCI",
    "number": 121,
  },
  "revision": "test",
  "slug": "test",
  "type": "test",
}
`)
		expect(actual.slug).toBe('test')
	})

	it('requires the top-level to have certain keys', () => {
		// $FlowExpectedError
		expect(() => enhanceHanson({slug: 'nope'})).toThrowError(
			'enhanceHanson(): "name" is missing in ["slug"] (need all of ["name", "requirements", "result", "revision", "type"]).',
		)

		// $FlowExpectedError
		expect(() => enhanceHanson({name: 'have a nice day'})).toThrowError(
			'enhanceHanson(): "requirements" is missing in ["name"] (need all of ["name", "requirements", "result", "revision", "type"]).',
		)

		expect(() => enhanceHanson({...basicFile()})).not.toThrow()
	})

	it('requires its input to be an object', () => {
		// $FlowExpectedError
		expect(() => enhanceHanson('')).toThrowError(
			'enhanceHanson: data was not an object!',
		)
	})

	it('requires "revision" to be a string, if present', () => {
		expect(() =>
			// $FlowExpectedError
			enhanceHanson({...basicFile(), revision: 2}),
		).toThrowError(
			'enhanceHanson: "revision" must be a string. Try wrapping it in single quotes.',
		)

		expect(() =>
			enhanceHanson({...basicFile(), revision: '2'}),
		).not.toThrow()
	})

	it('enforces a whitelist of keys at the top-level', () => {
		expect(() => enhanceHanson({...basicFile(), xxx: 'yyy'})).toThrowError(
			/only \[.*\] keys are allowed/,
		)
	})

	it('assumes that keys starting with a capital letter are requirements', () => {
		expect(() =>
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: 'CSCI 121',
				},
			}),
		).not.toThrow()
	})

	it('enforces a whitelist of keys at lower levels', () => {
		expect(() =>
			enhanceHansonRequirement({result: '', innerbad: 'zzzz'}),
		).toThrow(/only \[.*\] keys are allowed/)
	})

	it('expands string-only keys into objects with a "result" key', () => {
		const actual = enhanceHanson({
			...basicFile(),
			result: 'Requirement',
			requirements: {
				Requirement: 'CSCI 121',
			},
		})
		expect(actual).toMatchInlineSnapshot(`
Object {
  "name": "test",
  "requirements": Object {
    "Requirement": Object {
      "$type": "requirement",
      "result": Object {
        "$type": "course",
        "department": "CSCI",
        "number": 121,
      },
    },
  },
  "result": Object {
    "$requirement": "Requirement",
    "$type": "reference",
  },
  "revision": "test",
  "slug": "test",
  "type": "test",
}
`)
	})

	it('parses "result" strings with the Result PEG rule', () => {
		expect(() =>
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: {
						result: 'only courses from (CSCI 121)',
					},
				},
			}),
		).toThrowError('enhanceHanson: Expected expression but "o" found.')

		expect(() =>
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: {
						result: 'one of (CSCI 121)',
					},
				},
			}),
		).not.toThrow()

		expect(
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: {
						result: 'one of (CSCI 121)',
					},
				},
			}),
		).toMatchInlineSnapshot(`
Object {
  "name": "test",
  "requirements": Object {
    "Req": Object {
      "$type": "requirement",
      "result": Object {
        "$count": Object {
          "$num": 1,
          "$operator": "$gte",
        },
        "$of": Array [
          Object {
            "$type": "course",
            "department": "CSCI",
            "number": 121,
          },
        ],
        "$type": "of",
      },
    },
  },
  "result": Object {
    "$requirement": "Req",
    "$type": "reference",
  },
  "revision": "test",
  "slug": "test",
  "type": "test",
}
`)
	})

	it('parses "filter" strings with the Filter PEG rule', () => {
		expect(() =>
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: {
						filter: 'only courses from (CSCI 121)',
						result: 'any of (Req)',
					},
				},
			}),
		).not.toThrow()

		expect(
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: {
						filter: 'only courses from (CSCI 121)',
						result: 'any of (Req)',
					},
				},
			}),
		).toMatchInlineSnapshot(`
Object {
  "name": "test",
  "requirements": Object {
    "Req": Object {
      "$type": "requirement",
      "filter": Object {
        "$distinct": false,
        "$filterType": "of",
        "$of": Array [
          Object {
            "$type": "course",
            "department": "CSCI",
            "number": 121,
          },
        ],
        "$type": "filter",
      },
      "result": Object {
        "$count": Object {
          "$num": 1,
          "$operator": "$gte",
          "$was": "any",
        },
        "$of": Array [
          Object {
            "$requirement": "Req",
            "$type": "reference",
          },
        ],
        "$type": "of",
      },
    },
  },
  "result": Object {
    "$requirement": "Req",
    "$type": "reference",
  },
  "revision": "test",
  "slug": "test",
  "type": "test",
}
`)

		expect(() =>
			enhanceHanson({
				...basicFile(),
				result: 'Req',
				requirements: {
					Req: {
						filter: 'one of (CSCI 121)',
						result: 'Req',
					},
				},
			}),
		).toThrowError('enhanceHanson: Expected "only" but "o" found.')
	})

	it('allows defining variables in result', () => {
		const input = {
			...basicFile(),
			result: 'Req',
			requirements: {
				Req: {
					declare: {
						'math-level-3': 'MATH 330, 340, 344',
					},
					result: 'one of ($math-level-3)',
				},
			},
		}

		const output = enhanceHanson(input)

		// $FlowExpectedError
		expect(output.requirements.Req.result.$of.length).toBe(3)

		expect(output).toMatchInlineSnapshot(`
Object {
  "name": "test",
  "requirements": Object {
    "Req": Object {
      "$type": "requirement",
      "result": Object {
        "$count": Object {
          "$num": 1,
          "$operator": "$gte",
        },
        "$of": Array [
          Object {
            "$type": "course",
            "department": "MATH",
            "number": 330,
          },
          Object {
            "$type": "course",
            "department": "MATH",
            "number": 340,
          },
          Object {
            "$type": "course",
            "department": "MATH",
            "number": 344,
          },
        ],
        "$type": "of",
      },
    },
  },
  "result": Object {
    "$requirement": "Req",
    "$type": "reference",
  },
  "revision": "test",
  "slug": "test",
  "type": "test",
}
`)
	})

	it('allows using variables in the filter', () => {
		const input = {
			...basicFile(),
			result: 'Req',
			requirements: {
				Req: {
					declare: {
						'math-level-3': 'MATH 330, 340, 344',
					},
					filter: 'only courses from ($math-level-3)',
					result: 'Req',
				},
			},
		}

		const output = enhanceHanson(input)

		// $FlowExpectedError
		expect(output.requirements.Req.filter.$of.length).toBe(3)
		expect(output).toMatchInlineSnapshot(`
Object {
  "name": "test",
  "requirements": Object {
    "Req": Object {
      "$type": "requirement",
      "filter": Object {
        "$distinct": false,
        "$filterType": "of",
        "$of": Array [
          Object {
            "$type": "course",
            "department": "MATH",
            "number": 330,
          },
          Object {
            "$type": "course",
            "department": "MATH",
            "number": 340,
          },
          Object {
            "$type": "course",
            "department": "MATH",
            "number": 344,
          },
        ],
        "$type": "filter",
      },
      "result": Object {
        "$requirement": "Req",
        "$type": "reference",
      },
    },
  },
  "result": Object {
    "$requirement": "Req",
    "$type": "reference",
  },
  "revision": "test",
  "slug": "test",
  "type": "test",
}
`)
	})

	it('only allows the variables to be used where they are declared', () => {
		const input = {
			...basicFile(),
			result: 'Parent',
			requirements: {
				Parent: {
					declare: {
						'math-level-3': 'MATH 330, 340, 344',
					},
					Req: {
						result: 'one of ($math-level-3)',
					},
					result: 'Req',
				},
			},
		}

		expect(() => enhanceHanson(input)).toThrowError(
			'enhanceHanson: Expected expression but "o" found. (in \'one of ($math-level-3)\')',
		)
	})
})
