import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import Button from '../components/button'
import Icon from '../components/icon'
import Modal from '../components/modal'
import Toolbar from '../components/toolbar'

import studentActions from '../flux/student-actions'


export default class NewStudentScreen extends Component {
	static propTypes = {

	}

	constructor() {
		super()

		this.state = {}
	}

	render() {
		// alright.
		// basic info,
		// then areas,
		// then schedules.

		// can be:
		// - imported from the SIS
		// - imported from an export file
		// - shared from someone else
		// - filled in manually

		// oh, so this is where that module from dan abramov comes in - the
		// one that lets you change global state when a component is rendered

		const today = new Date()

		return (
			<Modal modalClassName='student-wizard'>
				<Toolbar>
					<Button>Import from File</Button>
					<Button>Open from Google Drive</Button>
				</Toolbar>

				<div className='intro'>
					<p>Welcome to Gobbldygook!</p>
					<p>
						We can import your course information from the St.
						Olaf SIS, from an exported file, from Google Drive, or
						you can just tell us about your stuff by hand.
					</p>
				</div>

				<form className='form'>
					<div><label>Name: <input type='text' /></label></div>
					<div><label>Matriculation: <input type='year' placeholder={today.getFullYear() - 2} /></label></div>
					<div><label>Graduation: <input type='year' placeholder={today.getFullYear() + 2} /></label></div>
					<div><label>Advisor: <input type='text' /></label></div>
					<div><label>Studies: <input type='text' /></label></div>
					<div><label>Schedules: <input type='text' /></label></div>
					<div><label>Overrides: <input type='text' /></label></div>
					<div><label>Fabrications: <input type='text' /></label></div>
				</form>
			</Modal>
		)
	}
}
