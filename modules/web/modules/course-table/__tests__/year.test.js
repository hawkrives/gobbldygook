// @flow

import Year from '../year'
import renderer from 'react-test-renderer'

test('Year ', () => {
    const addSemester = jest.fn()
    const removeSemester = jest.fn()
    const tree = renderer(<Year addSemester={addSemester} removeSemester={removeSemester} />)
})
