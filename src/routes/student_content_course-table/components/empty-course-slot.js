const React = require('react')
const {PropTypes} = React
import FakeCourse from './fake-course'
// import './empty-course-slot.css'

export default function EmptyCourseSlot({className}) {
	return <FakeCourse title='Empty Slot' className={`empty-course ${className}`} />
}

EmptyCourseSlot.propTypes = {
	className: PropTypes.string,
}
