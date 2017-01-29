import { loadHtml } from './import-student.support'
import { checkIfLoggedIn, checkPageIsLoggedIn } from '../logged-in'

describe('checkIfLoggedIn', () => {
	it('returns an error if the extension is not loaded', async () => {
		expect(async () => await checkIfLoggedIn()).toThrowError('Extension not loaded')
	})
})


describe('checkPageIsLoggedIn', () => {
	it('returns an error if the student is not logged in', async () => {
		expect(async () => await checkPageIsLoggedIn(loadHtml('landing-page')))
			.toThrowError('Not logged in. Please log into the SIS in another tab, then try again.')
	})

	it('returns the student ids if the page is logged in', async () => {
		const expr = async () => await checkPageIsLoggedIn(loadHtml('term-20121'))
		expect(expr).not.toThrowError()
		const val = await checkPageIsLoggedIn(loadHtml('term-20121'))
		expect(val).toEqual([ 101010 ])
	})
})
