// @flow

import React from 'react'
import {FlatButton} from '../../components/button'
import cx from 'classnames'
import {Set} from 'immutable'
import Autosize from 'react-input-autosize'
import {connect} from 'react-redux'
import {Student} from '@gob/object-student'
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

	render() {
		let nameEl = (
			<Autosize
				className="autosize-input"
				value={this.state.name}
				onChange={this.handleNameChange}
			/>
		)

		let matriculationEl = (
			<Autosize
				className={cx('autosize-input', {
					invalid: !this.state.matriculationIsValid,
				})}
				value={String(this.state.matriculation)}
				onChange={this.handleMatriculationChange}
			/>
		)

		let graduationEl = (
			<Autosize
				className={cx('autosize-input', {
					invalid: !this.state.graduationIsValid,
				})}
				value={String(this.state.graduation)}
				onChange={this.handleGraduationChange}
			/>
		)

		return (
			<div className="manual">
				<header className="header">
					<h1>Manually Create</h1>
				</header>

				{this.state.error && (
					<pre className="errors">{this.state.error}</pre>
				)}

				<div className="intro">
					Hi! My name is {nameEl}.<br />I matriculated in{' '}
					{matriculationEl}, and I plan to graduate in {graduationEl}.
				</div>

				<div className="areas">
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
				</div>

				<div className="actions">
					<FlatButton
						disabled={
							Boolean(this.state.error) || this.state.submitted
						}
						onClick={this.onCreateStudent}
					>
						{!this.state.error ? "Let's go!" : 'Hmm…'}
					</FlatButton>
				</div>
			</div>
		)
	}
}

export default connect(
	undefined,
	{initStudent},
)(ManualCreationScreen)
