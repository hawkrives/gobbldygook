import { expect } from 'chai'

import { setOverride, removeOverride } from '../overrides'

import {
	SET_OVERRIDE,
	REMOVE_OVERRIDE,
} from '../../constants'

describe('setOverride action', () => {
  it('returns an action to add an override', () => {
    let action = setOverride('id', 'override/path', true)
    expect(action).to.have.property('type', SET_OVERRIDE)
    expect(action).to.have.property('payload')
    expect(action.payload).to.be.an.object
    expect(action.payload).to.deep.equal({
      studentId: 'id',
      key: 'override/path',
      value: true,
    })
  })
})

describe('removeOverride action', () => {
  it('returns an action to remove an override', () => {
    let action = removeOverride('id', 'override/path')
    expect(action).to.have.property('type', REMOVE_OVERRIDE)
    expect(action).to.have.property('payload')
    expect(action.payload).to.be.an.object
    expect(action.payload).to.deep.equal({
      studentId: 'id',
      override: 'override/path',
    })
  })
})
