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
import styled from 'styled-components'

const AddAreaBlock = styled.div`
    padding: ${({ theme }) => theme.areaEdgePadding};
    border-top: ${({ theme }) => theme.materialDivider};
`

const AddAreaToolbar = styled(Toolbar)`
    margin-bottom: ${({ theme }) => theme.areaEdgePadding};
`

const AreaChoice = styled.li`
    display: flex;

    justify-content: space-between;
    align-items: center;

    & + & {
        margin-top: 0.5em;
    }
`

const AreaListing = styled.span`
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
`

const AreaListingTitle = styled.span`
    font-weight: 500;
`

const AreaListingRevision = styled.span`
    font-size: 0.8em;
`

const ToggleAreaButton = styled(Button)`
    padding: 0.25em 1em;
`

const AddAreaFilter = styled.input`
    flex: 1;
    border: solid 1px ${({ theme }) => theme.gray300};
    padding: 0.25em;
    margin-bottom: 0.5em;

    &:focus {
        background-color: ${({ theme }) => theme.blue50};
        border-color: ${({ theme }) => theme.blue500};
        outline: 0;
    }
`

type AreaOfStudy = Object
type PropTypes = {
    areaList: AreaOfStudy[],
    currentAreas: AreaOfStudy[],
    filterText: string,
    onAddArea: (AreaOfStudy, Event) => any,
    onFilterChange: Event => any,
    studentGraduation: number,
    type: AreaOfStudyTypeEnum,
}

function AreaPicker(props: PropTypes) {
    const graduation = props.studentGraduation

    const currentAreaNames = map(props.currentAreas, a => a.name)
    let onlyAvailableAreas = reject(props.areaList, area =>
        includes(currentAreaNames, area.name)
    )

    onlyAvailableAreas = filterAreaList(onlyAvailableAreas, { graduation })

    const filteredOnName = filter(onlyAvailableAreas, area =>
        fuzzysearch(props.filterText, area.name.toLowerCase())
    )

    const areaList = map(filteredOnName, (area, i) => (
        <AreaChoice key={area.name + i}>
            <AreaListing>
                <AreaListingTitle>{area.name}</AreaListingTitle>
                <AreaListingRevision>{area.revision}</AreaListingRevision>
            </AreaListing>
            <ToggleAreaButton
                type="flat"
                onClick={ev => props.onAddArea(area, ev)}
            >
                Add
            </ToggleAreaButton>
        </AreaChoice>
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
        <AddAreaBlock>
            <AddAreaToolbar>
                <AddAreaFilter
                    placeholder={`Filter ${pluralizeArea(props.type)}`}
                    value={props.filterText}
                    onChange={props.onFilterChange}
                />
            </AddAreaToolbar>

            <List type="plain">
                {areaList.length ? areaList : <li>{message}</li>}
            </List>
        </AddAreaBlock>
    )
}

export default class AreaPickerContainer extends React.PureComponent {
    state = {
        filter: '',
    }

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
