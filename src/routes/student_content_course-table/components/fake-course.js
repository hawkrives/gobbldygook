import React, {PropTypes} from 'react'
import cx from 'classnames'
import styles from '../../../components/inline-course.scss'
import {title} from '../../../components/course-title.scss'

export default function FakeCourse(props) {
	return (
		<article className={cx(styles.course, props.className)}>
			<div className={styles.row}>
				<h1 className={title}>{props.title}</h1>
				<p className={styles.summary}>{props.details}</p>
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
