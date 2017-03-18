// @flow
import React from 'react'
import fuzzysearch from 'fuzzysearch'
import pluralizeArea from '../../../examine-student/pluralize-area'
import map from 'lodash/map'
import reject from 'lodash/reject'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import { filterAreaList } from '../../../object-student/filter-area-list'
import type { AreaOfStudyTypeEnum } from '../../../examine-student/types'
import Button from '../../components/button'
import List from '../../components/list'
import Toolbar from '../../components/toolbar'

import './area-picker.scss'

type AreaOfStudy = Object;
type PropTypes = {
    areaList: AreaOfStudy[],
    currentAreas: AreaOfStudy[],
    filterText: string,
    onAddArea: (AreaOfStudy, Event) => any,
    onFilterChange: (Event) => any,
    studentGraduation: number,
    type: AreaOfStudyTypeEnum,
};

function AreaPicker(props: PropTypes) {
    const graduation = props.studentGraduation

    const currentAreaNames = map(props.currentAreas, a => a.name)
    let onlyAvailableAreas = reject(props.areaList, area =>
        includes(currentAreaNames, area.name))

    onlyAvailableAreas = filterAreaList(onlyAvailableAreas, { graduation })

    const filteredOnName = filter(onlyAvailableAreas, area =>
        fuzzysearch(props.filterText, area.name.toLowerCase()))

    const areaList = map(filteredOnName, (area, i) => (
        <li key={area.name + i} className="area--choice">
            <span className="area-listing">
                <span className="title">{area.name}</span>
                <span className="revision">{area.revision}</span>
            </span>
            <Button
                className="toggle-area"
                type="flat"
                onClick={ev => props.onAddArea(area, ev)}
            >
                Add
            </Button>
        </li>
    ))

    let message
    if (props.filterText) {
        message = `No matching ${pluralizeArea(props.type)}.`
    } else if (currentAreaNames.size) {
        message = `All ${pluralizeArea(props.type)} have been added.`
    } else {
        message = `No ${pluralizeArea(props.type)} are available.`
    }

    return (
        <div className="add-area">
            <Toolbar>
                <input
                    className="add-area--filter"
                    placeholder={`Filter ${pluralizeArea(props.type)}`}
                    value={props.filterText}
                    onChange={props.onFilterChange}
                />
            </Toolbar>

            <List type="plain">
                {areaList.length ? areaList : <li>{message}</li>}
            </List>
        </div>
    )
}

export default class AreaPickerContainer extends React.PureComponent {
    state = {
        filter: '',
    };

    render() {
        return (
            <AreaPicker
                {...this.props}
                filterText={this.state.filter}
                onFilterChange={ev =>
                    this.setState(() => ({
                        filter: (ev.target.value || '').toLowerCase(),
                    }))}
            />
        )
    }
}
