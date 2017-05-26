// @flow
import React from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import DocumentTitle from 'react-document-title'
import { isCurrentSemester } from '../../../object-student/is-current-semester'
import { semesterName } from '../../../school-st-olaf-college/course-info'
import debug from 'debug'
const log = debug('web:react')
import styled from 'styled-components'

const DetailText = styled.pre`
    background-color: white;
    margin: 0;
`

export default class SemesterDetail extends React.Component {
    props: {
        className?: string,
        location: {
            // react-router
            pathname: string,
            search: string,
        },
        params: {
            // react-router
            year: number,
            semester: number,
        },
        student: {
            data: {
                past: Object,
                present: Object,
                future: Object,
            },
        },
    }

    state = {
        year: null,
        semester: null,
        schedules: [],
    }

    render() {
        log('SemesterDetail#render')
        const { year, semester } = this.props.params
        const student = this.props.student.data.present

        const schedules = map(
            filter(student.schedules, isCurrentSemester(year, semester)),
            sched => omit(sched, 'courses')
        )

        const title = `${semesterName(semester)} ${year} • ${student.name} | Gobbldygook`

        return (
            <DocumentTitle title={title}>
                <DetailText>
                    {this.props.location.pathname}{'\n'}
                    {JSON.stringify(schedules, null, 2)}
                </DetailText>
            </DocumentTitle>
        )
    }
}
