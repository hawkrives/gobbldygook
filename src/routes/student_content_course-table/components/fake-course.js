import React, {PropTypes} from 'react'
import cx from 'classnames'
import '../../../components/inline-course.css'
import '../../../components/course-title.css'

export default function FakeCourse(props) {
	return (
		<article className={cx('course', props.className)}>
			<div className='row'>
				<h1 className='course-title'>{props.title}</h1>
				<p className='course-summary'>{props.details}</p>
			</div>
		</article>
	)
}

FakeCourse.propTypes = {
	className: PropTypes.string.isRequired,
	details: PropTypes.string,
	title: PropTypes.string.isRequired,
}

FakeCourse.defaultProps = {
	details: 'no details',
}
