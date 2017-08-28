import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { semesterName } from '../../../school-st-olaf-college/course-info'
import { buildDeptString } from '../../../school-st-olaf-college/deptnums'

import './expression--course.scss'

export default function CourseExpression(props) {
    const department = buildDeptString(props.department)

    const international = props.international && (
        <span className="course--international">I</span>
    )
    const lab =
        props.lab ||
        (props.type === 'Lab' && <span className="course--lab">L</span>)

    const section = props.section &&
    props.section !== '*' && (
        <span className="course--section">[{props.section}]</span>
    )

    const year = props.year && (
        <span className="course--year">{props.year}</span>
    )
    const semester = props.semester && (
        <span className="course--semester">
            {props.semester === '*' ? (
                'ANY'
            ) : (
                semesterName(props.semester).toUpperCase()
            )}
        </span>
    )

    /////

    const temporalIdentifiers = (semester || year) && (
        <div className="temporal">
            {semester}
            {year}
        </div>
    )

    return (
        <span
            className={cx('course', {
                matched: props._result,
                taken: props._taken,
            })}
            style={props.style}
        >
            <div className="basic-identifiers">
                <span className="course--department">{department}</span>
                <span>
                    <span className="course--number">
                        {props.number || String(props.level)[0] + 'XX'}
                    </span>
                    {international}
                    {lab ? 'L' : null} {section}
                </span>
            </div>
            {temporalIdentifiers}
        </span>
    )
}

CourseExpression.propTypes = {
    _result: PropTypes.bool,
    _taken: PropTypes.bool,
    department: PropTypes.arrayOf(PropTypes.string).isRequired,
    international: PropTypes.bool,
    lab: PropTypes.bool,
    level: PropTypes.number,
    number: PropTypes.number,
    section: PropTypes.string,
    semester: PropTypes.number,
    style: PropTypes.object,
    type: PropTypes.string,
    year: PropTypes.number,
}
