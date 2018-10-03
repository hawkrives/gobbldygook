// @flow

import React from 'react'
import cx from 'classnames'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import Requirement from './requirement'
import ProgressBar from '../../components/progress-bar'
import {close, chevronUp, chevronDown} from '../../icons/ionicons'
import {pathToOverride, type EvaluationResult} from '@gob/examine-student'
import {Student, type AreaQuery} from '@gob/object-student'
import {type ParsedHansonFile} from '@gob/hanson-format'
import {checkStudentAgainstArea} from '../../workers/check-student'
import {loadArea} from '../../helpers/load-area'

import './area-of-study.scss'

type Props = {
	areaOfStudy: AreaQuery,
	showCloseButton: boolean,
	showEditButton: boolean,
	student: Student,
}

type State = {|
	isOpen: boolean,
	confirmRemoval: boolean,
	examining: boolean,
	results: ?EvaluationResult,
	error: ?string,
|}

export class AreaOfStudy extends React.Component<Props, State> {
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
		this.props.student.setOverride(codifiedPath, true)
	}

	removeOverride = (path: string[], ev: Event) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		this.props.student.removeOverride(codifiedPath)
	}

	toggleOverride = (path: string[], ev: Event) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)

		if (this.props.student.hasOverride(codifiedPath)) {
			this.props.student.removeOverride(codifiedPath)
		} else {
			this.props.student.setOverride(codifiedPath, true)
		}
	}

	render() {
		let props = this.props
		let {isOpen, confirmRemoval: showConfirmRemoval} = this.state

		let {
			type = '???',
			revision = '0000-00',
			name = 'Unknown Area',
		} = props.areaOfStudy

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
			progressAt = this.state.results.progress.of
		}

		if (this.state.results && this.state.results.error) {
			error = this.state.results.error
		}

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
						onClick={ev => {
							ev.preventDefault()
							props.student.removeArea({name, type, revision})
						}}
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
		if (this.state.examining) {
			contents = <p className="message area--loading">Loading…</p>
		} else {
			contents = (
				<AreaDetails
					results={this.state.results}
					area={props.areaOfStudy}
				/>
			)
		}

		return (
			<>
				<header
					className="area--summary"
					onClick={this.toggleAreaExpansion}
				>
					{showConfirmRemoval ? removalConfirmation : summary}
				</header>

				{isOpen && !showConfirmRemoval && contents}
			</>
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

function AreaDetails(props: {results: ?EvaluationResult, area: AreaQuery}) {
	if (!props.results) {
		return null
	}

	let {type, name} = props.area
	let {details, error = ''} = props.results

	if (error) {
		return (
			<p className="message area--error">
				{error} {':('}
			</p>
		)
	}

	return (
		<Requirement
			info={details}
			topLevel
			onAddOverride={this.addOverride}
			onRemoveOverride={this.removeOverride}
			onToggleOverride={this.toggleOverride}
			path={[type, name]}
		/>
	)
}
