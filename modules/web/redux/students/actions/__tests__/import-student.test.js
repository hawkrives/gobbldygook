import { expect } from 'chai'

import { importStudent } from '../import-student'
import { IMPORT_STUDENT } from '../../constants'

describe('importStudent action', () => {
  it('returns an action to import a student', () => {
    let action = importStudent({ data: '{}', type: 'application/json' })

    expect(action).to.have.property('type', IMPORT_STUDENT)
    expect(action).to.have.property('payload')
  })

  it('defaults to processing an empty object if no arguments are given', () => {
    let action = importStudent()
    expect(action).to.have.property('error', true)
    expect(action).to.have.property('payload')
    expect(action.payload.message).to.equal('importStudent: undefined is an invalid data type')
  })

  it('includes an "error" property if there is an error', () => {
    let action = importStudent({ data: '^INVALID_JSON^', type: 'application/json' })
    expect(action).to.have.property('error', true)
    expect(action).to.have.property('payload')
    expect(action.payload.message.indexOf('Unexpected token ^')).to.equal(0)
  })

  it('includes an "error" property if the student is not json', () => {
    let action = importStudent({ data: '', type: 'text/html' })
    expect(action).to.have.property('error', true)
    expect(action).to.have.property('payload')
    expect(action.payload.message).to.equal('importStudent: text/html is an invalid data type')
  })

  it('includes an "error" property if there was no student in the json', () => {
    let action = importStudent({ data: 'null', type: 'application/json' })
    expect(action).to.have.property('error', true)
    expect(action).to.have.property('payload')
    expect(action.payload.message).to.equal('Could not process data: null')
  })
})
