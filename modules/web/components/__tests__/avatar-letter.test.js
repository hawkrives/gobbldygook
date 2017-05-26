import React from 'react'
import { shallow } from 'enzyme'
import AvatarLetter from '../avatar-letter'

describe('AvatarLetter', () => {
    it('renders a component', () => {
        const wrapper = shallow(<AvatarLetter />)
        expect(wrapper).toBeTruthy()
    })

    it('has the class avatar-letter', () => {
        const wrapper = shallow(<AvatarLetter />)
        expect(wrapper.hasClass('avatar-letter')).toBe(true)
    })

    it('accepts other classes via className', () => {
        const wrapper = shallow(<AvatarLetter className="test-class" />)
        expect(wrapper.hasClass('test-class')).toBe(true)
    })

    it('uses the first letter of the value as its text', () => {
        const wrapper = shallow(<AvatarLetter value={'Hawken'} />)
        expect(wrapper.text()).toBe('H')
    })

    it('uses an empty string by default', () => {
        const wrapper = shallow(<AvatarLetter />)
        expect(wrapper.text()).toBe('')
    })

    it('uses an empty string if value is not a string', () => {
        const wrapper = shallow(<AvatarLetter value={null} />)
        expect(wrapper.text()).toBe('')
    })
})
