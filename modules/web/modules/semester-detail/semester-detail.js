import React, { Component, PropTypes } from 'react'
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

// eslint-disable-next-line react/prefer-stateless-function
export default class SemesterDetail extends Component {
    static propTypes = {
        className: PropTypes.string,
        location: PropTypes.shape({
            // react-router
            pathname: PropTypes.string,
            search: PropTypes.string,
        }),
        params: PropTypes.object, // react-router
        student: PropTypes.object,
    };

    state = {
        year: null,
        semester: null,
        schedules: [],
    };

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
