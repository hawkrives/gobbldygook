// @flow

import React from 'react'

import groupBy from 'lodash/groupBy'
import toPairs from 'lodash/toPairs'
import values from 'lodash/values'

import AreaOfStudyGroup from './area-of-study-group'
import {FlatButton} from '../../components/button'
import {sortStudiesByType, areaTypeConstants} from '@gob/object-student'
import type {HydratedStudentType} from '@gob/object-student'

import './area-of-study-sidebar.scss'

type Props = {
	student: HydratedStudentType,
}

type State = {
	showAreaPickerFor: {[key: string]: boolean},
}

class AreaOfStudySidebarComponent extends React.PureComponent<Props, State> {
	state = {
		showAreaPickerFor: {},
	}

	showAreaPicker = (type: string, ev: Event) => {
		ev.preventDefault()
		this.setState(state => ({
			showAreaPickerFor: {...state.showAreaPickerFor, [type]: true},
		}))
	}

	hideAreaPicker = (type: string, ev: Event) => {
		ev.preventDefault()
		this.setState(state => ({
			showAreaPickerFor: {...state.showAreaPickerFor, [type]: false},
		}))
	}

	render() {
		let props = this.props
		let {student} = props
		let {showAreaPickerFor} = this.state

		let sortedStudies = sortStudiesByType(student.studies)

		// group the studies by their type
		let groupedStudies = groupBy(sortedStudies, study =>
			study.type.toLowerCase(),
		)

		// look up either the "study" or the "area result"
		let studyResults = toPairs(groupedStudies).map(([key, group]) => [
			key,
			group.map(
				area =>
					(student.areas || []).find(
						a =>
							a.name === area.name &&
							a.type === area.type &&
							a.revision === area.revision,
					) || area,
			),
		])

		let allAreaTypes = values(areaTypeConstants)
		let usedAreaTypes = new Set(student.studies.map(s => s.type))

		let unusedTypes = allAreaTypes.filter(
			type => !usedAreaTypes.has(type) && !showAreaPickerFor[type],
		)

		let unusedTypesToShow = toPairs(showAreaPickerFor).filter(
			([type, toShow]) => toShow && !usedAreaTypes.has(type),
		)

		return (
			<>
				{studyResults.map(([areaType, areas]) => (
					<AreaOfStudyGroup
						key={areaType}
						areas={areas}
						onEndAddArea={this.hideAreaPicker}
						onInitiateAddArea={this.showAreaPicker}
						showAreaPicker={showAreaPickerFor[areaType] || false}
						student={student}
						type={areaType}
					/>
				))}

				{unusedTypesToShow.map(([type, shouldShow]) => (
					<AreaOfStudyGroup
						key={type}
						areas={[]}
						onEndAddArea={this.hideAreaPicker}
						onInitiateAddArea={this.showAreaPicker}
						showAreaPicker={shouldShow || false}
						student={student}
						type={type}
					/>
				))}

				{unusedTypes.length && (
					<section className="unused-areas">
						<span className="unused-areas--title">Add: </span>
						<span className="unused-areas--container">
							{unusedTypes.map(type => (
								<FlatButton
									key={type}
									className="unused-areas--button"
									onClick={ev =>
										this.showAreaPicker(type, ev)
									}
								>
									{type}
								</FlatButton>
							))}
						</span>
					</section>
				)}
			</>
		)
	}
}

export const AreaOfStudySidebar = AreaOfStudySidebarComponent
