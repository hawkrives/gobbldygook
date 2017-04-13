// @flow
import React from 'react'
import { connect } from 'react-redux'

import difference from 'lodash/difference'
import filter from 'lodash/filter'
import find from 'lodash/find'
import groupBy from 'lodash/groupBy'
import includes from 'lodash/includes'
import keys from 'lodash/keys'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import toPairs from 'lodash/toPairs'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import values from 'lodash/values'

import AreaOfStudyGroup from './area-of-study-group'
import Button from '../../components/button'
const {
    sortStudiesByType,
} = require('../../../object-student/sort-studies-by-type')
const { areaTypeConstants } = require('../../../object-student/area-types')

type AreaOfStudy = Object
type Student = Object
type PropTypes = {
    allAreas: AreaOfStudy[],
    student: Student,
}

class AreaOfStudySidebarComponent extends React.PureComponent {
    props: PropTypes

    state: {
        showAreaPickerFor: { [key: string]: boolean },
    } = {
        showAreaPickerFor: {},
    }

    showAreaPicker = (type: string, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.setState(state => ({
            showAreaPickerFor: { ...state.showAreaPickerFor, [type]: true },
        }))
    }

    hideAreaPicker = (type: string, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.setState(state => ({
            showAreaPickerFor: { ...state.showAreaPickerFor, [type]: false },
        }))
    }

    render() {
        const props = this.props
        const { allAreas, student } = props
        const { showAreaPickerFor } = this.state
        const allAreasGrouped = groupBy(allAreas, 'type')

        const sortedStudies = sortStudiesByType(student.studies)

        // group the studies by their type
        const groupedStudies = groupBy(sortedStudies, study =>
            study.type.toLowerCase()
        )

        // pull out the results
        const studyResults = mapValues(groupedStudies, group =>
            map(
                group,
                area =>
                    find(
                        student.areas,
                        pick(area, ['name', 'type', 'revision'])
                    ) || area
            )
        )

        // and then render them
        const sections = map(studyResults, (areas, areaType) => (
            <AreaOfStudyGroup
                key={areaType}
                allAreasOfType={allAreasGrouped[areaType] || []}
                areas={areas}
                onEndAddArea={this.hideAreaPicker}
                onInitiateAddArea={this.showAreaPicker}
                showAreaPicker={showAreaPickerFor[areaType] || false}
                student={student}
                type={areaType}
            />
        ))

        const allAreaTypes = values(areaTypeConstants)
        const usedAreaTypes = uniq(map(student.studies, s => s.type))

        const areaTypesToShowButtonsFor = union(
            usedAreaTypes,
            keys(pickBy(showAreaPickerFor, v => v === true))
        )

        const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

        const unusedAreaTypeButtons = unusedTypes.length
            ? <section className="unused-areas-of-study">
                  <span className="unused-areas-title">Add: </span>
                  <span className="unused-areas-buttons">
                      {unusedTypes.map(type => (
                          <Button
                              key={type}
                              className="add-unused-area-of-study"
                              onClick={ev => this.showAreaPicker(type, ev)}
                              type="flat"
                          >
                              {type}
                          </Button>
                      ))}
                  </span>
              </section>
            : null

        const unusedTypesToShow = filter(
            toPairs(showAreaPickerFor),
            ([type, toShow]) =>
                toShow === true && !includes(usedAreaTypes, type)
        )

        const unusedTypesToShowComponents = map(unusedTypesToShow, ([
            type,
            shouldShow,
        ]) => (
            <AreaOfStudyGroup
                key={type}
                allAreasOfType={allAreasGrouped[type] || []}
                areas={[]}
                onEndAddArea={this.hideAreaPicker}
                onInitiateAddArea={this.showAreaPicker}
                showAreaPicker={shouldShow || false}
                student={student}
                type={type}
            />
        ))

        return (
            <div>
                {sections}
                {unusedTypesToShowComponents}
                {unusedAreaTypeButtons}
            </div>
        )
    }
}

const mapState = state => ({ allAreas: state.areas.data })

export const AreaOfStudySidebar = connect(mapState)(AreaOfStudySidebarComponent)
