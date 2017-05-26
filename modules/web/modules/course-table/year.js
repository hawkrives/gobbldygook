import React from 'react'
import PropTypes from 'prop-types'
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

import styled from 'styled-components'

const Container = styled.div`
    margin-bottom: ${props => props.theme.pageEdgePadding};
`

const row = `
    display: flex;
    flex-flow: row wrap;
`

const Header = styled.header`
    ${props => props.theme.noSelect}
    margin: 0;

    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;

    font-feature-settings: "tnum";

    line-height: 1em;
    font-weight: 500;
    font-size: 0.9em;
`

const TitleText = styled.h1`
    ${props => props.theme.headingNeutral}
    white-space: nowrap;
    flex: 1;

    /* 4px is the semester edge padding */
    /* 7.5px is the internal semester padding */
    /* TODO: replace this with variable references */
    margin-left: 4px + 7.5px;
`

const TitleButton = styled(Button)`
    transition: 0.15s;

    min-height: 0;
    padding: 0 0.5em;

    text-transform: none;
    font-feature-settings: "smcp";
    font-weight: 400;

    color: ${props => props.theme.gray500};

    & + & {
        margin-left: 0.1em;
    }
`

const RemoveYearButton = styled(TitleButton)`
    &:hover {
        color: ${props => props.theme.red500};
        background-color: ${props => props.theme.red50};
        border: solid 1px ${props => props.theme.red500};
    }
`

const SemesterList = styled.div`
    flex: 1;
    ${row}
`

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

        const nextAvailableSemester = findFirstAvailableSemester(
            schedules,
            year
        )
        const isAddSemesterDisabled = !canAddSemester(schedules, year)

        return (
            <Container>
                <Header>
                    <TitleText>{niceYear}</TitleText>

                    <span>
                        {!isAddSemesterDisabled &&
                            <TitleButton
                                type="flat"
                                title="Add Semester"
                                onClick={this.addSemester}
                            >
                                Add ‘{semesterName(nextAvailableSemester)}’
                            </TitleButton>}
                        <RemoveYearButton
                            type="flat"
                            title={`Remove the year ${niceYear}`}
                            onClick={this.removeYear}
                        >
                            Remove Year
                        </RemoveYearButton>
                    </span>
                </Header>
                <SemesterList>
                    {terms}
                </SemesterList>
            </Container>
        )
    }
}
