import { expect } from 'chai'
import { findWordForProgress } from '../find-word-for-progress'

describe('findWordForProgress', () => {
  it('properly handles each tenth of the float', () => {
    expect(findWordForProgress(100, 100)).to.equal('hundred')
    expect(findWordForProgress(100, 90)).to.equal('ninety')
    expect(findWordForProgress(100, 80)).to.equal('eighty')
    expect(findWordForProgress(100, 70)).to.equal('seventy')
    expect(findWordForProgress(100, 60)).to.equal('sixty')
    expect(findWordForProgress(100, 50)).to.equal('fifty')
    expect(findWordForProgress(100, 40)).to.equal('forty')
    expect(findWordForProgress(100, 30)).to.equal('thirty')
    expect(findWordForProgress(100, 20)).to.equal('twenty')
    expect(findWordForProgress(100, 10)).to.equal('ten')
    expect(findWordForProgress(100, 5)).to.equal('under-ten')
    expect(findWordForProgress(100, 0)).to.equal('zero')
  })

  it('handles numbers between tenths of a float', () => {
    expect(findWordForProgress(100, 75.52313)).to.equal('seventy')
  })
})
