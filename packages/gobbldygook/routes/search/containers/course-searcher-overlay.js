import React, {PropTypes} from 'react'
import withRouter from 'react-router/lib/withRouter'

import Modal from 'src/components/modal'
import CourseSearcher from 'src/containers/course-searcher'
import './course-searcher-overlay.scss'

function CourseSearcherOverlay(props) {
	const boundCloseModal = () => props.router.push({pathname: '/'})

	return (
		<Modal onClose={boundCloseModal} into='search-modal'>
			<CourseSearcher closeSearcher={boundCloseModal} />
		</Modal>
	)
}

CourseSearcherOverlay.propTypes = {
	router: PropTypes.object.isRequired,
}

export default withRouter(CourseSearcherOverlay)
