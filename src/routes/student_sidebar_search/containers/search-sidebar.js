import React, {PropTypes} from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import CourseSearcher from '../../../containers/course-searcher'

export default function CourseSearcherSidebar(props) {
	const boundCloseModal = () => props.push({pathname: '/'})

	return <CourseSearcher closeSearcher={boundCloseModal} />
}

CourseSearcherSidebar.propTypes = {
	push: PropTypes.func.isRequired, // redux
}

const mapDispatchToProps = dispatch => bindActionCreators({push: routeActions.push}, dispatch)

export default connect(undefined, mapDispatchToProps)(CourseSearcherSidebar)
