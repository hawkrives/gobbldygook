// @flow

import React from 'react'
import {FlatButton} from '../../components/button'
import cx from 'classnames'
import Autosize from 'react-input-autosize'
import {connect} from 'react-redux'
import {initStudent} from '../../redux/students/actions/init-student'
import {AreaPicker} from '../../components/area-of-study/picker'
import type {AreaOfStudyType} from '@gob/object-student'

import './method-manual.scss'

let now = new Date()

type Props = {
	dispatch: Function, // redux
	navigate: string => mixed, // react-router
}

type State = {
	error: string,
	name: string,
	matriculation: number,
	matriculationIsValid: boolean,
	graduation: number,
	graduationIsValid: boolean,
	degree: Array<AreaOfStudyType>,
	major: Array<AreaOfStudyType>,
	concentration: Array<AreaOfStudyType>,
	emphasis: Array<AreaOfStudyType>,
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
		degree: [],
		major: [],
		concentration: [],
		emphasis: [],
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
			() => ({
				matriculation: val,
				matriculationIsValid: isValid,
			}),
			this.checkValidity,
		)
	}

	handleGraduationChange = ev => {
		let val = parseInt(ev.target.value)
		let isValid = Boolean(val && ev.target.value.length === 4)
		this.setState(
			() => ({
				graduation: val,
				graduationIsValid: isValid,
			}),
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

		let studies = [
			...this.state.degree,
			...this.state.major,
			...this.state.concentration,
			...this.state.emphasis,
		]

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

		let action = initStudent(rawStudent)
		this.props.dispatch(action)
		this.props.navigate(`/student/${action.payload.id}`)
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
						selections={this.state.degree}
						onChange={this.handleAreaChange('degree')}
						availableThrough={this.state.graduation}
					/>
					<AreaPicker
						label="Majors"
						type="major"
						selections={this.state.major}
						onChange={this.handleAreaChange('major')}
						availableThrough={this.state.graduation}
					/>
					<AreaPicker
						label="Concentrations"
						type="concentration"
						selections={this.state.concentration}
						onChange={this.handleAreaChange('concentration')}
						availableThrough={this.state.graduation}
					/>
					<AreaPicker
						label="Areas of Emphasis"
						type="emphasis"
						selections={this.state.emphasis}
						onChange={this.handleAreaChange('emphasis')}
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

let mapDispatch = dispatch => ({dispatch})

export default connect(
	undefined,
	mapDispatch,
)(ManualCreationScreen)
