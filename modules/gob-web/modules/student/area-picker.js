// @flow
import React from 'react'
import fuzzysearch from 'fuzzysearch'
import {pluralizeArea, type AreaOfStudyTypeEnum} from '@gob/examine-student'
import map from 'lodash/map'
import reject from 'lodash/reject'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {filterAreaList, type AreaOfStudyType} from '@gob/object-student'
import {FlatButton} from '../../components/button'
import List from '../../components/list'
import {Toolbar} from '../../components/toolbar'
import styled from 'styled-components'
import * as theme from '../../theme'

const AddAreaBlock = styled('div')`
	padding: ${theme.areaEdgePadding};
	border-top: ${theme.materialDivider};
`

const AddAreaToolbar = styled(Toolbar)`
	margin-bottom: ${theme.areaEdgePadding};
`

const AreaChoice = styled('li')`
	display: flex;

	justify-content: space-between;
	align-items: center;

	& + & {
		margin-top: 0.5em;
	}
`

const AreaListing = styled('span')`
	flex: 1;
	display: flex;
	flex-flow: column nowrap;
`

const AreaListingTitle = styled('span')`
	font-weight: 500;
`

const AreaListingRevision = styled('span')`
	font-size: 0.8em;
`

const ToggleAreaButton = styled(FlatButton)`
	padding: 0.25em 1em;
`

const AddAreaFilter = styled('input')`
	flex: 1;
	border: solid 1px ${theme.gray300};
	padding: 0.25em;
	margin-bottom: 0.5em;

	&:focus {
		background-color: ${theme.blue50};
		border-color: ${theme.blue500};
		outline: 0;
	}
`

type Props = {
	areaList: Array<AreaOfStudyType>,
	currentAreas: Array<AreaOfStudyType>,
	onAddArea: (AreaOfStudyType, Event) => any,
	studentGraduation: number,
	type: AreaOfStudyTypeEnum,
}

type AreaPickerProps = Props & {
	filterText: string,
	onFilterChange: (SyntheticInputEvent<HTMLInputElement>) => any,
}

function AreaPicker(props: AreaPickerProps) {
	const graduation = props.studentGraduation

	const currentAreaNames = map(props.currentAreas, a => a.name)
	let onlyAvailableAreas = reject(props.areaList, area =>
		includes(currentAreaNames, area.name),
	)

	onlyAvailableAreas = filterAreaList(onlyAvailableAreas, {graduation})

	const filteredOnName = filter(onlyAvailableAreas, area =>
		fuzzysearch(props.filterText, area.name.toLowerCase()),
	)

	const areaList = map(filteredOnName, (area, i) => (
		<AreaChoice key={area.name + i}>
			<AreaListing>
				<AreaListingTitle>{area.name}</AreaListingTitle>
				<AreaListingRevision>{area.revision}</AreaListingRevision>
			</AreaListing>
			<ToggleAreaButton onClick={ev => props.onAddArea(area, ev)}>
				Add
			</ToggleAreaButton>
		</AreaChoice>
	))

	let message
	if (props.filterText) {
		message = `No matching ${pluralizeArea(props.type)}.`
	} else if (currentAreaNames.length) {
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

type AreaPickerContainerProps = Props

type AreaPickerContainerState = {
	filter: string,
}

export default class AreaPickerContainer extends React.PureComponent<
	AreaPickerContainerProps,
	AreaPickerContainerState,
> {
	state = {
		filter: '',
	}

	updateQuery = (ev: SyntheticInputEvent<HTMLInputElement>) => {
		let filter = (ev.target.value || '').toLowerCase()
		this.setState(() => ({filter}))
	}

	render() {
		return (
			<AreaPicker
				{...this.props}
				filterText={this.state.filter}
				onFilterChange={this.updateQuery}
			/>
		)
	}
}
