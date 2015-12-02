import {expect} from 'chai'
import combinations from '../../src/helpers/combinations'

function collect(comb) {
	let items = []
	for (let item of comb) {
		items.push(item)
	}
	return items
}

describe('combinations', () => {
	it('should be a function and return iterator', () => {
		expect(combinations).to.be.a.Function
		expect(combinations()).to.be.an.Object
		expect(combinations()).to.have.property('next')
		expect(combinations()).to.be.a.Function
		expect(combinations().next()).to.be.an.Object
		expect(combinations().next()).to.have.property('done')
	})

	it('should be iterable ', () => {
		let comb = combinations(['a', 'b'], 2)
		for (let item of comb) {
			expect(item).to.be.an.Array
			expect(item).to.eql(['a', 'b'])
		}
	})

	it('should return combinations', () => {
		let comb = combinations(['a', 'b', 'c'], 2)
		expect(collect(comb)).to.eql([['a', 'b'], ['a', 'c'], ['b', 'c']])
		expect(collect(combinations(new Array(7), 5))).to.have.length(21)
	})

	it('should not return wrong combinations', () => {
		expect(combinations(['a'], 0).next()).to.eql({done: true, value: undefined})
		expect(combinations(['a'], 2).next()).to.eql({done: true, value: undefined})
		expect(combinations(['a'], -1).next()).to.eql({done: true, value: undefined})
		expect(combinations([], 1).next()).to.eql({done: true, value: undefined})
		expect(combinations([], 0).next()).to.eql({done: true, value: undefined})
	})
})
