import React, { PropTypes } from 'react'

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

import { sortStudiesByType } from '../../../object-student/sort-studies-by-type'
import AreaOfStudyGroup from './area-of-study-group'
import Button from '../../components/button'
import { areaTypeConstants } from '../../../object-student/area-types'

export default function AreaOfStudySidebar(props) {
	const { allAreas, student, showAreaPickerFor } = props
	const allAreasGrouped = groupBy(allAreas, 'type')

	const sortedStudies = sortStudiesByType(student.studies)

	// group the studies by their type
	const groupedStudies = groupBy(sortedStudies, study => study.type.toLowerCase())

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
			studentGraduation={student.graduation}
			studentId={student.id}
			type={areaType}
		/>)

	const allAreaTypes = values(areaTypeConstants)
	const usedAreaTypes = uniq(map(student.studies, s => s.type))

	const areaTypesToShowButtonsFor = union(
		usedAreaTypes,
		keys(pickBy(showAreaPickerFor, k => k === true)))

	const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

	const unusedAreaTypeButtons = unusedTypes.length ? (
		<section className="unused-areas-of-study">
			<span className="unused-areas-title">Add: </span>
			<span className="unused-areas-buttons">
				{unusedTypes.map(type => (
					<Button key={type}
						className="add-unused-area-of-study"
						onClick={ev => props.onInitiateAddArea(type, ev)}
						type="flat"
					>
						{type}
					</Button>
				))}
			</span>
		</section>
	) : null

	const unusedTypesToShow = filter(toPairs(showAreaPickerFor),
		([type, toShow]) => toShow === true && !includes(usedAreaTypes, type))

	const unusedTypesToShowComponents = map(unusedTypesToShow, ([type, shouldShow]) =>
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
			studentGraduation={student.graduation}
			studentId={student.id}
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
