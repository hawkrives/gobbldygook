// @flow

import React from 'react'
import {RaisedButton} from '../../components/button'
import cx from 'classnames'
import {Set} from 'immutable'
import {connect} from 'react-redux'
import {Student} from '@gob/object-student'
import {Header} from './components'
import uniqueId from 'lodash/uniqueId'
import {
	action as initStudent,
	type ActionCreator as InitStudentFunc,
} from '../../redux/students/actions/init-student'
import {AreaPicker, type Selection} from '../../components/area-of-study/picker'

import './method-manual.scss'

let now = new Date()

type Props = {
	+initStudent: InitStudentFunc, // redux
	+navigate?: string => mixed, // react-router
}

type State = {
	error: string,
	name: string,
	matriculation: number,
	matriculationIsValid: boolean,
	graduation: number,
	graduationIsValid: boolean,
	degrees: Array<Selection>,
	majors: Array<Selection>,
	concentrations: Array<Selection>,
	emphases: Array<Selection>,
	submitted: boolean,
}

class ManualCreationScreen extends React.Component<Props, State> {
	state = {
		error: '',
		name: 'Black Widow',
		matriculation: now.getFullYear() - 3,
		matriculationIsValid: true,
		graduation: now.getFullYear() + 1,
		graduationIsValid: true,
		degrees: [],
		majors: [],
		concentrations: [],
		emphases: [],
		submitted: false,
	}

	handleAreaChange = type => values => {
		this.setState({[type]: values})
	}

	handleNameChange = ev => {
		this.setState({name: ev.target.value})
	}

	handleMatriculationChange = ev => {
		let val = parseInt(ev.target.value)
		let isValid = Boolean(val && ev.target.value.length === 4)
		this.setState(
			() => ({matriculation: val, matriculationIsValid: isValid}),
			this.checkValidity,
		)
	}

	handleGraduationChange = ev => {
		let val = parseInt(ev.target.value)
		let isValid = Boolean(val && ev.target.value.length === 4)
		this.setState(
			() => ({graduation: val, graduationIsValid: isValid}),
			this.checkValidity,
		)
	}

	checkValidity = () => {
		let errors = []

		if (!this.state.matriculationIsValid) {
			errors.push('Matriculation is invalid.')
		}
		if (!this.state.graduationIsValid) {
			errors.push('Graduation is invalid.')
		}

		this.setState(() => ({error: errors.join('\n')}))
	}

	onCreateStudent = () => {
		this.setState(() => ({submitted: true}))

		let studies = Set([
			...this.state.degrees,
			...this.state.majors,
			...this.state.concentrations,
			...this.state.emphases,
		])

		// pick out only the values that we want
		studies = studies.map(({name, revision, type}) => ({
			name,
			revision,
			type,
		}))

		let rawStudent = {
			name: this.state.name,
			matriculation: this.state.matriculation,
			graduation: this.state.graduation,
			studies,
		}

		let student = new Student((rawStudent: any))

		this.props.initStudent(student)
		if (!this.props.navigate) {
			throw new Error('no navigate prop passed!')
		}
		this.props.navigate(`/student/${student.id}`)
	}

	onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()
	}

	nameLabelId = `student-editor--${uniqueId()}`
	matriculationLabelId = `student-editor--${uniqueId()}`
	graduationLabelId = `student-editor--${uniqueId()}`

	render() {
		return (
			<div className="manual">
				<Header>
					<h1>Manually Create</h1>
				</Header>

				{this.state.error && (
					<pre className="errors">{this.state.error}</pre>
				)}

				<form onSubmit={this.onSubmit} className="student-editor">
					<label htmlFor={this.nameLabelId}>Name:</label>
					<input
						id={this.nameLabelId}
						onChange={this.handleNameChange}
						onBlur={this.onSubmit}
						value={this.state.name}
					/>

					<label htmlFor={this.matriculationLabelId}>
						Matriculation:
					</label>
					<input
						id={this.matriculationLabelId}
						onChange={this.handleMatriculationChange}
						onBlur={this.onSubmit}
						value={this.state.matriculation}
						type="number"
						className={cx({
							invalid: !this.state.matriculationIsValid,
						})}
					/>

					<label htmlFor={this.graduationLabelId}>Graduation:</label>
					<input
						id={this.graduationLabelId}
						onChange={this.handleGraduationChange}
						onBlur={this.onSubmit}
						value={this.state.graduation}
						type="number"
						className={cx({invalid: !this.state.graduationIsValid})}
					/>

					<AreaPicker
						label="Degrees"
						type="degree"
						selections={this.state.degrees}
						onChange={values =>
							this.setState(() => ({degrees: values}))
						}
						availableThrough={this.state.graduation}
					/>
					<AreaPicker
						label="Majors"
						type="major"
						selections={this.state.majors}
						onChange={values =>
							this.setState(() => ({majors: values}))
						}
						availableThrough={this.state.graduation}
					/>
					<AreaPicker
						label="Concentrations"
						type="concentration"
						selections={this.state.concentrations}
						onChange={values =>
							this.setState(() => ({concentrations: values}))
						}
						availableThrough={this.state.graduation}
					/>
					<AreaPicker
						label="Areas of Emphasis"
						type="emphasis"
						selections={this.state.emphases}
						onChange={values =>
							this.setState(() => ({emphases: values}))
						}
						availableThrough={this.state.graduation}
					/>
				</form>

				<div className="intro">
					Hi! My name is {this.state.name}.<br />I matriculated in{' '}
					{String(this.state.matriculation)}, and I plan to graduate
					in {String(this.state.graduation)}.
				</div>

				<div className="actions">
					<RaisedButton
						disabled={
							Boolean(this.state.error) || this.state.submitted
						}
						onClick={this.onCreateStudent}
					>
						{!this.state.error ? "Let's go!" : 'Hmm…'}
					</RaisedButton>
				</div>
			</div>
		)
	}
}

export default connect(
	undefined,
	{initStudent},
)(ManualCreationScreen)
