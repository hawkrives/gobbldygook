import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { expandYear } from '../../../school-st-olaf-college/course-info'

import { findFirstAvailableYear } from '../../helpers/find-first-available-year'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'

import Button from '../../components/button'
import Year from './year'

import './course-table.scss'

export default function CourseTable(props) {
    const { student } = props
    const { schedules, matriculation, graduation } = student

    const nextAvailableYear = findFirstAvailableYear(schedules, matriculation)
    const canAddYear = true // graduation > nextAvailableYear

    const nextYearButton =
        canAddYear &&
        <Button
            className="add-year"
            key="add-year"
            type="flat"
            title="Add Year"
            onClick={props.addYear}
        >
            {`Add ${expandYear(nextAvailableYear, false, '–')}`}
        </Button>

    let sorted = sortBy(schedules, 'year')
    let grouped = groupBy(sorted, 'year')

    let years = map(grouped, (schedules, year) => (
        <Year
            key={year}
            year={Number(year)}
            student={student}
            addSemester={() => props.addSemester(Number(year))}
            removeYear={() => props.removeYear(Number(year))}
        />
    ))
    years.splice(nextAvailableYear - matriculation, 0, nextYearButton)

    return (
        <div className={cx('course-table', props.className)}>
            {years}
        </div>
    )
}

CourseTable.propTypes = {
    addSemester: PropTypes.func.isRequired,
    addYear: PropTypes.func.isRequired,
    className: PropTypes.string,
    removeYear: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
}
