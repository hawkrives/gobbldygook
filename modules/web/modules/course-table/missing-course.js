import React from 'react'
import PropTypes from 'prop-types'
import FakeCourse from './fake-course'

export default function MissingCourse(props) {
    return (
        <FakeCourse
            title={`Cannot load course ${props.clbid}`}
            details={String(props.error)}
            className={`missing ${props.className}`}
        />
    )
}

MissingCourse.propTypes = {
    className: PropTypes.string,
    clbid: PropTypes.number.isRequired,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)])
        .isRequired,
}
