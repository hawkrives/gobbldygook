import React from 'react'
import PropTypes from 'prop-types'
import FakeCourse from './fake-course'
import './empty-course-slot.scss'

export default function EmptyCourseSlot({ className }) {
    return (
        <FakeCourse
            title="Empty Slot"
            className={`empty-course ${className}`}
        />
    )
}

EmptyCourseSlot.propTypes = {
    className: PropTypes.string,
}
