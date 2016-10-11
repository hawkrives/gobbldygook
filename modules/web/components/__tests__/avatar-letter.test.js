import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import AvatarLetter from '../avatar-letter'

describe('AvatarLetter', () => {
	it('renders a component', () => {
		const wrapper = shallow(<AvatarLetter />)
		expect(wrapper).to.be.ok
	})

	it('has the class avatar-letter', () => {
		const wrapper = shallow(<AvatarLetter />)
		expect(wrapper.hasClass('avatar-letter')).to.be.true
	})

	it('accepts other classes via className', () => {
		const wrapper = shallow(<AvatarLetter className='test-class' />)
		expect(wrapper.hasClass('test-class')).to.be.true
	})

	it('uses the first letter of the value as its text', () => {
		const wrapper = shallow(<AvatarLetter value={'Hawken'} />)
		expect(wrapper.text()).to.equal('H')
	})

	it('uses an empty string by default', () => {
		const wrapper = shallow(<AvatarLetter />)
		expect(wrapper.text()).to.equal('')
	})

	it('uses an empty string if value is not a string', () => {
		const wrapper = shallow(<AvatarLetter value={null} />)
		expect(wrapper.text()).to.equal('')
	})
})
