import { expect } from 'chai'
import { loadHtml } from './import-student.support'
import { checkIfLoggedIn, checkPageIsLoggedIn } from '../logged-in'

describe('checkIfLoggedIn', () => {
  it('returns an error if the extension is not loaded', async () => {
    const actual = await checkIfLoggedIn().catch(err => err)
    expect(actual instanceof Error).to.be.true
    expect(actual.message).to.equal('Extension not loaded')
  })

})


describe('checkPageIsLoggedIn', () => {
  it('returns an error if the student is not logged in', async () => {
    const actual = await checkPageIsLoggedIn(loadHtml('landing-page')).catch(err => err)
    expect(actual instanceof Error).to.be.true
    expect(actual.message).to.equal('Not logged in. Please log into the SIS in another tab, then try again.')
  })

  it('returns the student ids if the page is logged in', async () => {
    const actual = await checkPageIsLoggedIn(loadHtml('term-20121')).catch(err => err)
    expect(actual instanceof Error).to.be.false
    expect(actual).to.deep.equal([ 101010 ])
  })
})
