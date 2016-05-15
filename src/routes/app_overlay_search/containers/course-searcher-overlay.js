import React, {PropTypes} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Modal from 'src/components/modal'
import CourseSearcher from 'src/containers/course-searcher'
import './course-searcher-overlay.css'

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

const mapDispatchToProps = dispatch => bindActionCreators({push}, dispatch)

export default connect(undefined, mapDispatchToProps)(CourseSearcherOverlay)
