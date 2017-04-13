import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import map from 'lodash/map'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import DocumentTitle from 'react-document-title'
import { isCurrentSemester } from '../../../object-student/is-current-semester'
import { semesterName } from '../../../school-st-olaf-college/course-info'
import debug from 'debug'
const log = debug('web:react')

import './semester-detail.scss'

export default class SemesterDetail extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        location: PropTypes.shape({
            // react-router
            pathname: PropTypes.string,
            search: PropTypes.string,
        }),
        params: PropTypes.object, // react-router
        student: PropTypes.object,
    }

    constructor() {
        super()
        this.state = {
            year: null,
            semester: null,
            schedules: [],
        }
    }

    render() {
        log('SemesterDetail#render')
        const { year, semester } = this.props.params
        const student = this.props.student.data.present

        const schedules = map(
            filter(student.schedules, isCurrentSemester(year, semester)),
            sched => omit(sched, 'courses')
        )

        return (
            <DocumentTitle
                title={`${semesterName(semester)} ${year} • ${student.name} | Gobbldygook`}
            >
                <div className={cx('semester-detail', this.props.className)}>
                    <pre>
                        {this.props.location.pathname}{'\n'}
                        {JSON.stringify(schedules, null, 2)}
                    </pre>
                </div>
            </DocumentTitle>
        )
    }
}
