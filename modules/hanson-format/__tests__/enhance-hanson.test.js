import { enhanceHanson } from '../enhance-hanson'
import { reference, course } from './parse-hanson-string/parse-hanson-string.support'

describe('enhanceHanson', () => {
	it('adds a "slug" key to the top-level', () => {
		const actual = enhanceHanson({
			name: 'test',
			message: 'have a nice day',
		})
		expect(actual.slug).toBe('test')
	})

	it('marks the top-level as a "requirement"', () => {
		const actual = enhanceHanson({
			message: 'have a nice day',
		})
		expect(actual.$type).toBe('requirement')
	})

	it('requires the top-level to have certain keys', () => {
		expect(() => enhanceHanson({ $type: 'a', slug: 'nope' }))
			.toThrowError('enhanceHanson(): could not find any of ["result", "message", "filter"] in ["$type", "slug"].')

		expect(() => enhanceHanson({ 'message': 'have a nice day' })).not.toThrow()

		expect(() => enhanceHanson({ 'result': 'CSCI 121' })).not.toThrow()
	})

	it('requires its input to be an object', () => {
		expect(() => enhanceHanson(''))
			.toThrowError('enhanceHanson: data was not an object!')
	})

	it('requires "revision" to be a string, if present', () => {
		expect(() => enhanceHanson({ revision: 2, result: 'CSCI 121' }))
			.toThrowError('enhanceHanson: "revision" must be a string. Try wrapping it in single quotes.')

		expect(() => enhanceHanson({ revision: '2', result: 'CSCI 121' }))
			.not.toThrow()
	})

	it('enforces a whitelist of keys at the top-level', () => {
		expect(() => enhanceHanson({ result: '', xxx: 'yyy' }))
			.toThrowError(/only \[.*\] keys are allowed/)
	})

	it('assumes that keys starting with a capital letter are requirements', () => {
		expect(() => enhanceHanson({
			result: 'Req',
			Req: 'CSCI 121',
		})).not.toThrow()
	})

	it('enforces a whitelist of keys at lower levels', () => {
		expect(() => enhanceHanson({ result: '', innerbad: 'zzzz' }, { topLevel: false }))
			.toThrow(/only \[.*\] keys are allowed/)
	})

	it('expands string-only keys into objects with a "result" key', () => {
		const actual = enhanceHanson({
			result: 'Requirement',
			Requirement: 'CSCI 121',
		})
		expect(actual).toEqual({
			slug: '',
			result: reference('Requirement'),
			$type: 'requirement',
			Requirement: {
				$type: 'requirement',
				result: course('CSCI 121'),
			},
		})
	})

	it('parses "result" strings with the Result PEG rule', () => {
		expect(() => enhanceHanson({
			result: 'Req',
			Req: {
				result: 'only courses from (CSCI 121)',
			},
		})).toThrowError('enhanceHanson: Expected expression but "o" found.')

		expect(() => enhanceHanson({
			result: 'Req',
			Req: {
				result: 'one of (CSCI 121)',
			},
		})).not.toThrow()
	})

	it('parses "filter" strings with the Filter PEG rule', () => {
		expect(() => enhanceHanson({
			result: 'Req',
			Req: {
				filter: 'only courses from (CSCI 121)',
			},
		})).not.toThrow()

		expect(() => enhanceHanson({
			result: 'Req',
			Req: {
				filter: 'one of (CSCI 121)',
			},
		})).toThrowError('enhanceHanson: Expected "only" but "o" found.')
	})

	it('allows defining variables in result', () => {
		const input = {
			result: 'Req',
			Req: {
				declare: {
					'math-level-3': 'MATH 330, 340, 344, 348, 351, 356, 364, 382, 384',
				},
				result: 'one of ($math-level-3)',
			},
		}
		const output = enhanceHanson(input)

		expect(output.Req.result.$of.length).toBe(9)
	})

	it('allows defining variables in filter', () => {
		const input = {
			result: 'Req',
			Req: {
				declare: {
					'math-level-3': 'MATH 330, 340, 344, 348, 351, 356, 364, 382, 384',
				},
				filter: 'only courses from ($math-level-3)',
			},
		}
		const output = enhanceHanson(input)

		expect(output.Req.filter.$of.length).toBe(9)
	})

	it('only persists the variables definition one level deep', () => {
		const input = {
			result: 'Req',
			Parent: {
				declare: {
					'math-level-3': 'MATH 330, 340, 344, 348, 351, 356, 364, 382, 384',
				},
				Req: {
					result: 'one of ($math-level-3)',
				},
				result: 'Req',
			},
		}

		expect(() => enhanceHanson(input)).toThrowError('enhanceHanson: Expected expression but "o" found. (in \'one of ($math-level-3)\')')
	})
})
