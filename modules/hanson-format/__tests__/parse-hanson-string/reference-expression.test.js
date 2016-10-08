import {expect} from 'chai'
import {parse} from '../../parse-hanson-string'

describe('ReferenceExpression', () => {
	it('can reference a requirement', () => {
		expect(parse('BTS-B')).to.deep.equal({
			$type: 'reference',
			$requirement: 'BTS-B',
		})
	})

	it('handles a full requirement title', () => {
		expect(parse('Biblical Studies (BTS-B)')).to
			.have.property('$requirement', 'Biblical Studies (BTS-B)')
	})

	it('returns a full requirement title when given an abbreviation', () => {
		expect(parse('BTS-B', {abbreviations: {'BTS-B': 'Biblical Studies (BTS-B)'}})).to
			.have.property('$requirement', 'Biblical Studies (BTS-B)')
	})

	it('returns a full requirement title when given the title-minus-abbreviation', () => {
		expect(parse('Biblical Studies', {titles: {'Biblical Studies': 'Biblical Studies (BTS-B)'}})).to
			.have.property('$requirement', 'Biblical Studies (BTS-B)')
	})

	describe('titles may include', () => {
		it('letters "A-Z"', () => {
			expect(() => parse('ABC')).not.to.throw()
			expect(() => parse('A')).not.to.throw()
		})
		it('numbers "0-9"', () => {
			expect(() => parse('A0')).not.to.throw()
			expect(() => parse('0')).not.to.throw()
			expect(() => parse('0A')).not.to.throw()
		})
		it('hyphen "-"', () => {
			expect(() => parse('ABC-D')).not.to.throw()
		})
		it('underscore "_"', () => {
			expect(() => parse('ABC_D')).not.to.throw()
		})
		it('parentheses "()"', () => {
			expect(() => parse('A0 (B)')).not.to.throw()
			expect(() => parse('A0 (B-B)')).not.to.throw()
		})
		it('may only begin with a letter or number', () => {
			expect(() => parse('0A')).not.to.throw()
			expect(() => parse('A0')).not.to.throw()
			expect(() => parse('_A0')).to.throw('Expected expression but "_" found.')
			expect(() => parse('-A0')).to.throw('Expected expression but "-" found.')
			expect(parse('(A0)')).to.have.property('$type', 'reference')
		})
	})
})
