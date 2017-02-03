import React, { PropTypes } from 'react'
import FakeCourse from './fake-course'
import './empty-course-slot.scss'

export default function EmptyCourseSlot({ className }) {
	return <FakeCourse title="Empty Slot" className={`empty-course ${className}`} />
}

EmptyCourseSlot.propTypes = {
	className: PropTypes.string,
}
