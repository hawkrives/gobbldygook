import React, { PropTypes } from 'react'
import cx from 'classnames'
import '../course/inline-course.scss'
import '../course/course-title.scss'

export default function FakeCourse(props) {
    return (
        <article className={cx('course', props.className)}>
            <div className="course-row">
                <h1 className="course-title">{props.title}</h1>
            </div>
            <div className="course-row course-summary">
                <p>{props.details}</p>
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
