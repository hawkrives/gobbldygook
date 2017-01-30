import { expect } from 'chai'
import saveStudentsMiddleware, { shouldTakeAction } from '../save-students'
import { LOAD_STUDENTS, CHANGE_NAME } from '../../students/constants'
import { LOG_MESSAGE } from '../../notifications/constants'

xdescribe('shouldTakeAction', () => {
	it('should ignore LOAD_STUDENTS', () => {
		expect(shouldTakeAction({ type: LOAD_STUDENTS })).to.be.false
	})
	it('should ignore non-student actions', () => {
		expect(shouldTakeAction({ type: LOG_MESSAGE })).to.be.false
	})
	it('should allow other student actions', () => {
		expect(shouldTakeAction({ type: CHANGE_NAME })).to.be.true
	})
})

describe('saveStudentsMiddleware', () => {
	const doDispatch = () => {}
	const doGetState = () => ({ students: { '123': { data: { past: [], future: [], present: {} } } } })
	const doNextAction = (...args) => [ ...args ]
	const nextHandler = saveStudentsMiddleware({ dispatch: doDispatch, getState: doGetState })

	it('must return a function to handle `next`', () => {
		expect(typeof nextHandler).to.equal('function')
		expect(nextHandler.length).to.equal(1)
	})

	describe('handle next', () => {
		it('must return a function to handle action', () => {
			const actionHandler = nextHandler(doNextAction)

			expect(typeof actionHandler).to.equal('function')
			expect(actionHandler.length).to.equal(1)
		})

		describe('handle action', () => {
			it('should return a promise', () => {
				const actionHandler = nextHandler(doNextAction)
				expect(actionHandler({ type: CHANGE_NAME }).then).to.be.a.function
			})

			xit('should save a student if something has changed', () => {
				const date = Date.now()
				const customDoNextAction = ({ studentId }) => {
					return { students: { present: { [studentId]: { id: studentId, dateLastModified: date } } } }
				}

				const actionHandler = nextHandler(customDoNextAction)

				return actionHandler({ type: CHANGE_NAME }).then(() => {
					expect(JSON.parse(localStorage.getItem('a')))
						.to.deep.equal({ id: 'a', dateLastModified: date })
				})
			})

			xit('should not save a student if nothing has changed', () => {

			})
		})
	})
})
