import { loadHtml } from './import-student.support'
import { checkPageIsLoggedIn } from '../logged-in'

describe('checkPageIsLoggedIn', () => {
	it('returns an error if the student is not logged in', () => {
		expect(() => checkPageIsLoggedIn(loadHtml('landing-page')))
			.toThrowError('Not logged in. Please log into the SIS in another tab, then try again.')
	})

	it('returns the student ids if the page is logged in', async () => {
		expect(() => checkPageIsLoggedIn(loadHtml('term-20121'))).not.toThrowError()
		const val = await checkPageIsLoggedIn(loadHtml('term-20121'))
		expect(val).toEqual([101010])
	})
})
