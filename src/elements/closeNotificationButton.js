import React, {Component} from 'react'
import Button from './button'

export default class CloseNotificationButton extends Component {
	render() {
		return <Button type='flat' className='close-notification' title='Close'>×</Button>
	}
}
