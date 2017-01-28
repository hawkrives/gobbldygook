import { expect } from 'chai'
import hasOverride from '../has-override'

describe('hasOverride', () => {
  it('checks if an override exists', () => {
    expect(hasOverride([ 'a', 'b', 'c' ], { 'a.b.c': true })).to.be.true
  })

  it('doesn\'t just return the value of the override', () => {
    expect(hasOverride([ 'a', 'b', 'c' ], { 'a.b.c': false })).to.be.true
  })
})
