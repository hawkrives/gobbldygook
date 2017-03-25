import React, { PropTypes } from 'react'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import map from 'lodash/map'

import Button from '../../components/button'
import Semester from './semester-container'

import {
    findFirstAvailableSemester,
} from '../../helpers/find-first-available-semester'
import {
    expandYear,
    semesterName,
} from '../../../school-st-olaf-college/course-info'

import './year.scss'

const canAddSemester = (schedules, year) =>
    findFirstAvailableSemester(schedules, year) <= 5

export default class Year extends React.PureComponent {
    // props: PropTypes;
    static propTypes = {
        addSemester: PropTypes.func.isRequired,
        removeYear: PropTypes.func.isRequired,
        student: PropTypes.object.isRequired,
        year: PropTypes.number.isRequired,
    }

    addSemester = () => {
        this.props.addSemester(this.props.year)
    }

    removeYear = () => {
        this.props.removeYear(this.props.year)
    }

    render() {
        const { student, year } = this.props
        const { schedules } = student

        let valid = filter(schedules, { active: true, year: year })
        let sorted = sortBy(valid, 'semester')
        let terms = map(sorted, schedule => (
            <Semester
                key={`${schedule.year}-${schedule.semester}-${schedule.id}`}
                student={student}
                semester={schedule.semester}
                year={year}
            />
        ))

        const niceYear = expandYear(year)

        const nextAvailableSemester = findFirstAvailableSemester(schedules, year)
        const isAddSemesterDisabled = !canAddSemester(schedules, year)

        return (
            <div className="year">
                <header className="year-title">
                    <h1>{niceYear}</h1>

                    <span className="buttons">
                        {!isAddSemesterDisabled &&
                            <Button
                                className="add-semester"
                                type="flat"
                                title="Add Semester"
                                disabled={isAddSemesterDisabled}
                                onClick={this.addSemester}
                            >
                                Add ‘{semesterName(nextAvailableSemester)}’
                            </Button>}
                        <Button
                            className="remove-year"
                            type="flat"
                            title={`Remove the year ${niceYear}`}
                            onClick={this.removeYear}
                        >
                            Remove Year
                        </Button>
                    </span>
                </header>
                <div className="row semester-list">
                    {terms}
                </div>
            </div>
        )
    }
}
