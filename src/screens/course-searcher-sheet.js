import React, {PropTypes} from 'react'

import omit from 'lodash/object/omit'
import Modal from '../components/modal'
import CourseSearcher from './course-searcher'

function closeModal(location, router) {
	const query = omit(location.query, ['search-overlay'])
	router.push({pathname: location.pathname, query})
}

export default function CourseSearcherSheet(props, context) {
	const { actions } = props
	const boundCloseModal = () => closeModal(context.location, context.router)

	return <Modal
		modalClassName='course-searcher--modal'
		onClose={boundCloseModal}
	>
		<CourseSearcher
			actions={actions}
			closeSearcher={boundCloseModal}
			isHidden={false}
		/>
	</Modal>
}

CourseSearcherSheet.propTypes = {
	actions: PropTypes.objectOf(PropTypes.func).isRequired,
}

CourseSearcherSheet.contextTypes = {
	location: PropTypes.object.isRequired,
	router: PropTypes.object.isRequired,
}
