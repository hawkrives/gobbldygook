// @flow

import React from 'react'
import cx from 'classnames'
import {connect} from 'react-redux'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import Requirement from './requirement'
import ProgressBar from '../../components/progress-bar'
import {close, chevronUp, chevronDown} from '../../icons/ionicons'
import {pathToOverride, type EvaluationResult} from '@gob/examine-student'
import {Student, type AreaQuery} from '@gob/object-student'
import {checkStudentAgainstArea} from '../../workers/check-student'
import {loadArea} from '../../helpers/load-area'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'

import './area-of-study.scss'

type AreaOfStudyType = {
	_area: Object,
	_checked?: boolean,
	_error?: string,
	_progress?: {at: number, of: number},
	isCustom?: boolean,
	name: string,
	revision: string,
	slug?: string,
	type: string,
}

type Props = {
	areaOfStudy: AreaQuery,
	showCloseButton: boolean,
	showEditButton: boolean,
	student: Student,
	changeStudent: ChangeStudentFunc,
}

type State = {|
	isOpen: boolean,
	confirmRemoval: boolean,
	examining: boolean,
	results: ?EvaluationResult,
	error: ?string,
|}

class AreaOfStudy extends React.Component<Props, State> {
	state = {
		isOpen: false,
		confirmRemoval: false,
		examining: false,
		results: null,
		error: null,
	}

	componentDidMount() {
		this.startExamination()
	}

	startExamination = async () => {
		this.setState(() => ({examining: true}))
		let area = await loadArea(this.props.areaOfStudy)

		if (area.error) {
			this.setState(() => ({examining: false, error: area.message}))
			return
		}

		let results = await checkStudentAgainstArea(
			this.props.student,
			area.data,
		)
		this.setState(() => ({examining: false, results}))
	}

	startRemovalConfirmation = (ev: Event) => {
		ev.preventDefault()
		this.setState({confirmRemoval: true})
	}

	endRemovalConfirmation = (ev: Event) => {
		ev.preventDefault()
		this.setState({confirmRemoval: false})
	}

	toggleAreaExpansion = (ev: Event) => {
		ev.preventDefault()
		this.setState({isOpen: !this.state.isOpen})
	}

	addOverride = (path: string[], ev: Event) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		let s = this.props.student.setOverride(codifiedPath, true)
		this.props.changeStudent(s)
	}

	removeOverride = (path: string[], ev: Event) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		let s = this.props.student.removeOverride(codifiedPath)
		this.props.changeStudent(s)
	}

	toggleOverride = (path: string[], ev: Event) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)

		if (this.props.student.hasOverride(codifiedPath)) {
			let s = this.props.student.removeOverride(codifiedPath)
			this.props.changeStudent(s)
		} else {
			let s = this.props.student.setOverride(codifiedPath, true)
			this.props.changeStudent(s)
		}
	}

	removeArea = (ev: SyntheticEvent<HTMLButtonElement>) => {
		ev.preventDefault()
		let s = this.props.student.removeArea(this.props.areaOfStudy)
		this.props.changeStudent(s)
	}

	render() {
		let props = this.props
		let {isOpen, confirmRemoval: showConfirmRemoval, examining} = this.state

		let {name = 'Unknown Area'} = props.areaOfStudy

		// TODO: fix slugs
		// let slug = ''
		// if (this.state.results) {
		// 	slug = this.state.results.slug
		// }

		let progressAt = 0
		let progressOf = 1

		let error = false

		if (this.state.results && this.state.results.progress) {
			progressAt = this.state.results.progress.at
			progressOf = this.state.results.progress.of
		}

		if (this.state.results && this.state.results.error) {
			error = this.state.results.error
		}

		let areaDetails = this.state.results

		const summary = (
			<>
				<div className="area--summary-row">
					<h1 className="area--title">
						<CatalogLink slug={'' /*slug*/} name={name} />
					</h1>
					<span className="icons">
						{props.showCloseButton && (
							<FlatButton
								className="area--remove-button"
								onClick={this.startRemovalConfirmation}
							>
								<Icon>{close}</Icon>
							</FlatButton>
						)}
						<Icon className="area--open-indicator">
							{isOpen ? chevronUp : chevronDown}
						</Icon>
					</span>
				</div>
				<ProgressBar
					className={cx('area--progress', {error: Boolean(error)})}
					colorful={true}
					value={progressAt}
					max={progressOf}
				/>
			</>
		)

		const removalConfirmation = (
			<div className="area--confirm-removal">
				<p>
					Remove <strong>{name}</strong>?
				</p>
				<span className="button-group">
					<FlatButton
						className="area--actually-remove-area"
						onClick={this.removeArea}
					>
						Remove
					</FlatButton>
					<FlatButton onClick={this.endRemovalConfirmation}>
						Cancel
					</FlatButton>
				</span>
			</div>
		)

		let contents = null
		if (error) {
			contents = (
				<p className="message area--error">
					{error} {':('}
				</p>
			)
		} else if (this.state.examining) {
			contents = <p className="message area--loading">Loading…</p>
		} else {
			contents = (
				<Requirement
					info={(areaDetails: any)}
					topLevel
					onAddOverride={this.addOverride}
					onRemoveOverride={this.removeOverride}
					onToggleOverride={this.toggleOverride}
					path={[this.props.areaOfStudy.type, name]}
				/>
			)
		}

		const className = cx('area', {
			errored: Boolean(error),
			loading: this.state.examining,
		})

		return (
			<div className={className}>
				<div
					className="area--summary"
					onClick={this.toggleAreaExpansion}
				>
					{showConfirmRemoval ? removalConfirmation : summary}
				</div>
				{isOpen && !showConfirmRemoval && contents}
			</div>
		)
	}
}

const CatalogLink = ({slug, name}: {slug: ?string, name: string}) => {
	if (!slug) {
		return <span>{name}</span>
	}

	return (
		<a
			className="catalog-link"
			href={`http://catalog.stolaf.edu/academic-programs/${slug}/`}
			target="_blank"
			rel="noopener noreferrer"
			title="View in the St. Olaf Catalog"
		>
			{name}
		</a>
	)
}

const connected = connect(
	undefined,
	{changeStudent},
)(AreaOfStudy)

export {connected as AreaOfStudy}
