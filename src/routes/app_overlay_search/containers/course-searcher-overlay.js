import React, {PropTypes} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import Modal from '../../../components/modal'
import CourseSearcher from '../../../containers/course-searcher'
import './course-searcher-overlay.scss'

export default function CourseSearcherOverlay(props) {
	const boundCloseModal = () => props.push({pathname: '/'})

	return (
		<Modal onClose={boundCloseModal} into='search-modal'>
			<CourseSearcher closeSearcher={boundCloseModal} />
		</Modal>
	)
}

CourseSearcherOverlay.propTypes = {
	push: PropTypes.func.isRequired, // redux
}

const actions = {push: routeActions.push}
const mapDispatchToProps = dispatch => ({
	...bindActionCreators(actions, dispatch),
})

export default connect(undefined, mapDispatchToProps)(CourseSearcherOverlay)
