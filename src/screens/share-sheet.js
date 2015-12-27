import React, {PropTypes} from 'react'

import omit from 'lodash/object/omit'
import history from '../history'
import Button from '../components/button'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'
import Modal from '../components/modal'
import List from '../components/list'

function closeModal(location) {
	const query = omit(location.query, ['share'])
	history.pushState(null, location.pathname, query)
}

export default function ShareSheet(props, context) {
	const {
		student,
	} = props

	return <Modal
		backdropClassName='modal-backdrop'
		modalClassName='course course--modal'
		onClose={() => closeModal(context.location)}
	>
		<Toolbar className='window-tools'>
			<Button className='close-modal' onClick={() => closeModal(context.location)}>
				<Icon name='close' />
			</Button>
		</Toolbar>

		<div>
			Share "{student.name}" via:
			<List type='bullet'>
				<li>Google Drive</li>
				<li>Email File</li>
				<li>Download File</li>
			</List>
		</div>
	</Modal>
}

ShareSheet.propTypes = {
	student: PropTypes.object,
}

ShareSheet.contextTypes = {
	location: PropTypes.object,
}
