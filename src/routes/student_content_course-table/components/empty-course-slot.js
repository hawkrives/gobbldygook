import React, {PropTypes} from 'react'
import FakeCourse from './fake-course'
import styles from './empty-course-slot.scss'

export default function EmptyCourseSlot({className}) {
	return <FakeCourse title='Empty Slot' className={`${styles.empty} ${className}`} />
}

EmptyCourseSlot.propTypes = {
	className: PropTypes.string,
}
