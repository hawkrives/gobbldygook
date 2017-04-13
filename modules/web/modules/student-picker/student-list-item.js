import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Link from 'react-router/lib/Link'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import { interpose } from '../../../lib/interpose'
import { sortStudiesByType } from '../../../object-student'

import Button from '../../components/button'
import Icon from '../../components/icon'
import { iosTrashOutline, iosArrowForward } from '../../icons/ionicons'

import './student-list-item.scss'

export default function StudentListItem(props) {
    const { student, isEditing, destroyStudent } = props

    const isLoading =
        student.isLoading ||
        student.isFetching ||
        student.isValdiating ||
        student.isChecking
    let opts = { loading: isLoading }
    if (!isLoading) {
        opts['can-graduate'] = student.data.present.canGraduate
        opts['cannot-graduate'] = !student.data.present.canGraduate
    }

    const classname = cx('student-list-item-container', opts)

    let sortedStudies = sortStudiesByType(student.data.present.studies)
    const groupedStudies = groupBy(sortedStudies, s => s.type)
    return (
        <li className={classname}>
            {isEditing &&
                <Button
                    className="delete"
                    type="flat"
                    onClick={() => destroyStudent(student.data.present.id)}
                >
                    <Icon>{iosTrashOutline}</Icon>
                    Delete
                </Button>}
            <Link
                className="student-list-item"
                to={`/s/${student.data.present.id}/`}
            >
                <span className="student-list-item-info">
                    <div className="name">
                        {`${student.data.present.name} ${process.env.NODE_ENV !== 'production' ? '(' + student.data.present.id + ')' : ''}` ||
                            ''}
                    </div>
                    <div className="areas">
                        {map(
                            interpose(
                                map(groupedStudies, group =>
                                    group.map(s => s.name).join(' · ')
                                ),
                                <span className="joiner">|</span>
                            ),
                            (group, i) => (
                                <span className="area-type" key={i}>
                                    {group}
                                </span>
                            )
                        )}
                    </div>
                </span>

                <Icon className="student-list-item--go">{iosArrowForward}</Icon>
            </Link>
        </li>
    )
}

StudentListItem.propTypes = {
    destroyStudent: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    student: PropTypes.object.isRequired,
}
