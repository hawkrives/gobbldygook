import {expect} from 'chai'
import React from 'react/addons'
import {Notifications} from '../../src/screens/notifications'
import Notification from '../../src/components/notification'

const { TestUtils } = React.addons

function setup() {
	const props = {
		addTodo: expect.createSpy(),
	}

	const renderer = TestUtils.createRenderer()
	renderer.render(<Notifications {...props} />)
	const output = renderer.getRenderOutput()

	return {
		props,
		output,
		renderer,
	}
}

describe('<Notifications />', () => {
	// jsdomReact()
	it('should render correctly', () => {
		const { output } = setup()

		console.log(output)

		// expect(output.type).toBe('header')
		// expect(output.props.className).toBe('header')

		// const [h1, input] = output.props.children

		// expect(h1.type).toBe('h1')
		// expect(h1.props.children).toBe('todos')

		// expect(input.type).toBe(Notification)
		// expect(input.props.newTodo).toBe(true)
		// expect(input.props.placeholder).toBe('What needs to be done?')
	})

	// it('should call addTodo if length of text is greater than 0', () => {
	// 	const { output, props } = setup()
	// 	const input = output.props.children[1]
	// 	input.props.onSave('')
	// 	expect(props.addTodo.calls.length).toBe(0)
	// 	input.props.onSave('Use Redux')
	// 	expect(props.addTodo.calls.length).toBe(1)
	// })
})
