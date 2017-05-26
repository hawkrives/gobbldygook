import saveStudentsMiddleware, { shouldTakeAction } from '../save-students'
import { LOAD_STUDENTS, CHANGE_NAME } from '../../students/constants'
import { LOG_MESSAGE } from '../../../modules/notifications/redux/constants'

xdescribe('shouldTakeAction', () => {
    it('should ignore LOAD_STUDENTS', () => {
        expect(shouldTakeAction({ type: LOAD_STUDENTS })).toBe(false)
    })
    it('should ignore non-student actions', () => {
        expect(shouldTakeAction({ type: LOG_MESSAGE })).toBe(false)
    })
    it('should allow other student actions', () => {
        expect(shouldTakeAction({ type: CHANGE_NAME })).toBe(true)
    })
})

describe('saveStudentsMiddleware', () => {
    const doDispatch = () => {}
    const doGetState = () => ({
        students: { '123': { data: { past: [], future: [], present: {} } } },
    })
    const doNextAction = (...args) => [...args]
    const nextHandler = saveStudentsMiddleware({
        dispatch: doDispatch,
        getState: doGetState,
    })

    it('must return a function to handle `next`', () => {
        expect(typeof nextHandler).toBe('function')
        expect(nextHandler.length).toBe(1)
    })

    describe('handle next', () => {
        it('must return a function to handle action', () => {
            const actionHandler = nextHandler(doNextAction)

            expect(typeof actionHandler).toBe('function')
            expect(actionHandler.length).toBe(1)
        })

        describe('handle action', () => {
            it('should return a promise', () => {
                const actionHandler = nextHandler(doNextAction)
                expect(typeof actionHandler({ type: CHANGE_NAME }).then).toBe('function')
            })

            xit('should save a student if something has changed', async () => {
                const date = Date.now()
                const customDoNextAction = ({ studentId }) => {
                    return {
                        students: {
                            present: {
                                [studentId]: {
                                    id: studentId,
                                    dateLastModified: date,
                                },
                            },
                        },
                    }
                }

                const actionHandler = nextHandler(customDoNextAction)

                await actionHandler({ type: CHANGE_NAME })
                expect(JSON.parse(localStorage.getItem('a')))
                    .toBe({ id: 'a', dateLastModified: date })
            })

            xit('should not save a student if nothing has changed', () => {})
        })
    })
})
