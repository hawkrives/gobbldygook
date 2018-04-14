import React from 'react'
import {mount} from 'enzyme'
import {AvatarLetter} from '../avatar-letter'

describe('AvatarLetter', () => {
    it('renders a component', () => {
        const wrapper = mount(<AvatarLetter />)
        expect(wrapper).toBeTruthy()
    })

    it('accepts other classes via className', () => {
        const wrapper = mount(<AvatarLetter className="test-class" />)
        expect(wrapper.hasClass('test-class')).toBe(true)
    })

    it('uses the first letter of the value as its text', () => {
        const wrapper = mount(<AvatarLetter value={'Hawken'} />)
        expect(wrapper.text()).toBe('H')
    })

    it('uses an empty string by default', () => {
        const wrapper = mount(<AvatarLetter />)
        expect(wrapper.text()).toBe('')
    })

    it('uses an empty string if value is not a string', () => {
        const wrapper = mount(<AvatarLetter value={null} />)
        expect(wrapper.text()).toBe('')
    })
})
