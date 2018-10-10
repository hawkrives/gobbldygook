// @flow

import React from 'react'
import {connect} from 'react-redux'
import {Student, type AreaQuery} from '@gob/object-student'
import {pathToOverride} from '@gob/examine-student'
import {AreaOfStudyProvider} from './provider'
import {AreaOfStudy} from './area-of-study'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'

type Props = {
	areaOfStudy: AreaQuery,
	student: Student,
	changeStudent: ChangeStudentFunc,
}

type State = {|
	isOpen: boolean,
|}

class AreaOfStudyConnector extends React.Component<Props, State> {
	state = {
		isOpen: false,
	}

	toggleAreaExpansion = (ev: Event) => {
		ev.stopPropagation()
		this.setState({isOpen: !this.state.isOpen})
	}

	addOverride = (path: string[], ev: Event) => {
		ev.stopPropagation()
		const codifiedPath = pathToOverride(path)
		let s = this.props.student.setOverride(codifiedPath, true)
		this.props.changeStudent(s)
	}

	removeOverride = (path: string[], ev: Event) => {
		ev.stopPropagation()
		const codifiedPath = pathToOverride(path)
		let s = this.props.student.removeOverride(codifiedPath)
		this.props.changeStudent(s)
	}

	toggleOverride = (path: string[], ev: Event) => {
		ev.stopPropagation()
		const codifiedPath = pathToOverride(path)

		if (this.props.student.hasOverride(codifiedPath)) {
			let s = this.props.student.removeOverride(codifiedPath)
			this.props.changeStudent(s)
		} else {
			let s = this.props.student.setOverride(codifiedPath, true)
			this.props.changeStudent(s)
		}
	}

	render() {
		let {areaOfStudy, student} = this.props

		return (
			<AreaOfStudyProvider areaOfStudy={areaOfStudy} student={student}>
				{({error, examining, results}) => {
					return (
						<AreaOfStudy
							areaOfStudy={areaOfStudy}
							error={error}
							examining={examining}
							results={results}
							isOpen={this.state.isOpen}
							onToggleOpen={this.toggleAreaExpansion}
							onAddOverride={this.addOverride}
							onRemoveOverride={this.removeOverride}
							onToggleOverride={this.toggleOverride}
						/>
					)
				}}
			</AreaOfStudyProvider>
		)
	}
}

const connected = connect(
	undefined,
	{changeStudent},
)(AreaOfStudyConnector)

export {connected as ConnectedAreaOfStudy}
