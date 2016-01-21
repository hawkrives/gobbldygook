import React, {PropTypes} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import Modal from '../../../components/modal'
import CourseSearcher from '../../../containers/course-searcher'

export default function CourseSearcherSheet(props) {
	const boundCloseModal = () => props.push({pathname: '/'})

	return <Modal
		modalClassName='course-searcher--modal'
		onClose={boundCloseModal}
	>
		<CourseSearcher closeSearcher={boundCloseModal} />
	</Modal>
}

CourseSearcherSheet.propTypes = {
	push: PropTypes.func.isRequired, // redux
}

const actions = {push: routeActions.push}
const mapDispatchToProps = dispatch => ({
	...bindActionCreators(actions, dispatch),
})

export default connect(undefined, mapDispatchToProps)(CourseSearcherSheet)
