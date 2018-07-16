import React from 'react'
import PropTypes from 'prop-types'
import FakeCourse from './fake-course'

export default function MissingCourse(props) {
	console.warn(props.id, props.error)
	return (
		<FakeCourse
			title={`Cannot load course ${props.id}`}
			details={String(props.error)}
			className={`missing ${props.className}`}
		/>
	)
}

MissingCourse.propTypes = {
	className: PropTypes.string,
	error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)]).isRequired,
	id: PropTypes.number.isRequired,
}
