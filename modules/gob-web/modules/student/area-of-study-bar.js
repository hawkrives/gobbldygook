// @flow

import React from 'react'
import {List, Map} from 'immutable'
import {Tooltip, IconButton} from 'evergreen-ui'
import {
	sortStudiesByType,
	areaTypeConstants,
	Student,
} from '@gob/object-student'

type Props = {
	student: Student,
}

type State = {
	showAreaPickerFor: Map<string, boolean>,
}

export class AreaOfStudyBar extends React.PureComponent<Props, State> {
	state = {
		showAreaPicker: false,
	}

	addArea = () => {
		this.setState(() => ({showAreaPicker: true}))
	}

	render() {
		let props = this.props
		let {student} = props
		let {showAreaPickerFor} = this.state

		let sortedStudies = List(sortStudiesByType([...student.studies]))

		let activeAreas = sortedStudies.map(area => (
			<span key={`${area.name}${String(area.revision)}`}>
				{area.name}
			</span>
			/*<AreaOfStudy
					key={`${area.name}${String(area.revision)}`}
					areaOfStudy={area}
					student={student}
				/>*/
		))

		return (
			<>
				{[...activeAreas.values()]}
				<Tooltip content="Add an Area of Study">
					<IconButton onClick={this.addArea} icon="plus" />
				</Tooltip>
			</>
		)
	}
}
