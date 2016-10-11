import {expect} from 'chai'
import {customParser} from './parse-hanson-string.support'
const parseReference = customParser({allowedStartRules: ['Reference']})
const parseRequirementTitle = customParser({allowedStartRules: ['RequirementTitle']})

describe('ReferenceExpression', () => {
	it('can reference a requirement', () => {
		expect(parseReference('BTS-B')).to.deep.equal({
			$type: 'reference',
			$requirement: 'BTS-B',
		})
	})

	it('handles a full requirement title', () => {
		expect(parseReference('Biblical Studies (BTS-B)')).to
			.have.property('$requirement', 'Biblical Studies (BTS-B)')
	})

	it('returns a full requirement title when given an abbreviation', () => {
		expect(parseReference('BTS-B', {abbreviations: {'BTS-B': 'Biblical Studies (BTS-B)'}})).to
			.have.property('$requirement', 'Biblical Studies (BTS-B)')
	})

	it('returns a full requirement title when given the title-minus-abbreviation', () => {
		expect(parseReference('Biblical Studies', {titles: {'Biblical Studies': 'Biblical Studies (BTS-B)'}})).to
			.have.property('$requirement', 'Biblical Studies (BTS-B)')
	})
})

describe('titles may include', () => {
	it('letters "A-Z"', () => {
		expect(() => parseRequirementTitle('ABC')).not.to.throw()
		expect(() => parseRequirementTitle('A')).not.to.throw()
	})

	it('numbers "0-9"', () => {
		expect(() => parseRequirementTitle('A0')).not.to.throw()
		expect(() => parseRequirementTitle('0')).not.to.throw()
		expect(() => parseRequirementTitle('0A')).not.to.throw()
	})

	it('hyphen "-"', () => {
		expect(() => parseRequirementTitle('ABC-D')).not.to.throw()
	})

	it('underscore "_"', () => {
		expect(() => parseRequirementTitle('ABC_D')).not.to.throw()
	})

	it('may only begin with a letter or number', () => {
		expect(() => parseRequirementTitle('0A')).not.to.throw()
		expect(() => parseRequirementTitle('A0')).not.to.throw()
		expect(() => parseRequirementTitle('_A0')).to.throw('SyntaxError: Expected [A-Z0-9] but "_" found.')
		expect(() => parseRequirementTitle('-A0')).to.throw('SyntaxError: Expected [A-Z0-9] but "-" found.')
		expect(parseRequirementTitle('A0')).to.equal('A0')
	})
})
