import React, {PropTypes} from 'react'

import includes from 'lodash/collection/includes'
import difference from 'lodash/array/difference'
import union from 'lodash/array/union'
import values from 'lodash/object/values'
import find from 'lodash/collection/find'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import groupBy from 'lodash/collection/groupBy'
import uniq from 'lodash/array/uniq'
import keys from 'lodash/object/keys'
import pick from 'lodash/object/pick'

import AreaOfStudyGroup from './area-of-study-group'
import Button from '../../../components/button'
import * as areaTypeConstants from '../../../models/area-types'

export default function AreaOfStudySidebar(props) {
	const {allAreas, student, showAreaPickerFor} = props
	const allAreasGrouped = groupBy(allAreas, 'type')

	// group the studies by their type
	const groupedStudies = groupBy(student.studies, study => study.type.toLowerCase())

	// pull out the results
	const studyResults = mapValues(groupedStudies, group =>
		map(group, area =>
			find(student.areas, pick(area, ['name', 'type', 'revision'])) || area))

	// and then render them
	const sections = map(studyResults, (areas, areaType) =>
		<AreaOfStudyGroup key={areaType}
			allAreasOfType={allAreasGrouped[areaType] || []}
			areas={areas}
			onAddArea={props.onAddArea}
			onAddOverride={props.onAddOverride}
			onEndAddArea={props.onEndAddArea}
			onInitiateAddArea={props.onInitiateAddArea}
			onRemoveArea={props.onRemoveArea}
			onRemoveOverride={props.onRemoveOverride}
			onToggleOverride={props.onToggleOverride}
			showAreaPicker={showAreaPickerFor[areaType] || false}
			student={student}
			type={areaType}
		/>)

	const allAreaTypes = values(areaTypeConstants)
	const usedAreaTypes = uniq(map(student.studies, s => s.type))

	const areaTypesToShowButtonsFor = union(
		usedAreaTypes,
		keys(pick(showAreaPickerFor, k => k === true)))

	const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

	const unusedAreaTypeButtons = unusedTypes.length ? (
		<section className='unused-areas-of-study'>
			<span className='unused-areas-title'>Add: </span>
			<span className='unused-areas-buttons'>
				{unusedTypes.map(type => (
					<Button key={type}
						className='add-unused-area-of-study'
						onClick={ev => props.onInitiateAddArea(type, ev)}
						type='flat'
					>
						{type}
					</Button>
				))}
			</span>
		</section>
	) : null

	const unusedTypesToShow = pick(showAreaPickerFor,
		(toShow, type) => toShow === true && !includes(usedAreaTypes, type))

	const unusedTypesToShowComponents = map(unusedTypesToShow, (shouldShow, type) =>
		<AreaOfStudyGroup key={type}
			allAreasOfType={allAreasGrouped[type] || []}
			areas={[]}
			onAddArea={props.onAddArea}
			onAddOverride={props.onAddOverride}
			onEndAddArea={props.onEndAddArea}
			onInitiateAddArea={props.onInitiateAddArea}
			onRemoveArea={props.onRemoveArea}
			onToggleOverride={props.onToggleOverride}
			showAreaPicker={shouldShow || false}
			student={student}
			type={type}
		/>)

	return (
		<div>
			{sections}
			{unusedTypesToShowComponents}
			{unusedAreaTypeButtons}
		</div>
	)
}
AreaOfStudySidebar.propTypes = {
	allAreas: PropTypes.arrayOf(PropTypes.object).isRequired,
	onAddArea: PropTypes.func.isRequired,
	onAddOverride: PropTypes.func.isRequired,
	onEndAddArea: PropTypes.func.isRequired,
	onInitiateAddArea: PropTypes.func.isRequired,
	onRemoveArea: PropTypes.func.isRequired,
	onRemoveOverride: PropTypes.func.isRequired,
	onToggleOverride: PropTypes.func.isRequired,
	showAreaPickerFor: PropTypes.object.isRequired,
	student: PropTypes.object.isRequired,
}
