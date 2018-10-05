// @flow
import React, {Component} from 'react'

import {
	isRequirementName,
	type Requirement as RequirementType,
	type ComputationResult,
} from '@gob/examine-student'

import {Icon} from '../../components/icon'
import {iosBoltOutline, iosBolt} from '../../icons/ionicons'
import Filter from './expression--filter'
import Expression from './expression'
import {FlatButton} from '../../components/button'
import ResultIndicator from './result-indicator'

import './requirement.scss'

// type RequirementInfo = {
// 	computed?: boolean,
// 	description?: string,
// 	filter?: Object,
// 	message?: string,
// 	result?: Object,
// 	overridden?: boolean,
// 	[key: string]: RequirementInfo,
// }

type Props = {
	onAddOverride: (string[], Event) => any,
	onRemoveOverride: (string[], Event) => any,
	onToggleOverride: (string[], Event) => any,
	path: string[],
	topLevel?: boolean,
	info: ?(RequirementType | ComputationResult),
	name?: string,
}

type RequirementProps = Props & {
	isOpen?: boolean,
	onToggleOpen: () => any,
}

export function Requirement(props: RequirementProps) {
	const {topLevel = false} = props

	let info =
		props.info && props.info.$type === 'computation-result'
			? props.info.details
				? props.info.details
				: {}
			: props.info
				? props.info
				: {}

	const childKeys = Object.keys(info).filter(isRequirementName)

	const wasEvaluated = info.result && info.result._checked
	const computationClassName = wasEvaluated
		? info.computed || info.result._result
			? 'result-success'
			: 'result-failure'
		: ''

	const status = (
		<ResultIndicator result={info.computed || info.result._result} />
	)

	const extraClasses = [info.overridden ? 'overridden' : '']

	const result = info.result && (
		<div className="result">
			<Expression expr={info.result} ctx={info} />
		</div>
	)

	const message = info.message && <p className="message">{info.message}</p>
	const description = info.description && (
		<p className="description">{info.description}</p>
	)

	const filterEl = info.filter && <Filter expr={info.filter} ctx={info} />

	const title = !topLevel && (
		<h2 className="heading" title={info.name} onClick={props.onToggleOpen}>
			<span className="title">
				{' '}
				{props.name}
				<span className="status">{status}</span>
			</span>
			<span className="manual-override">
				<span className="overridden-msg">
					{info.overridden ? '(Overridden) ' : ''}
				</span>
				<FlatButton
					title={`${
						info.overridden ? 'Remove' : 'Apply'
					} a manual override to this requirement`}
					onClick={ev => props.onToggleOverride(props.path, ev)}
				>
					<Icon>{info.overridden ? iosBolt : iosBoltOutline}</Icon>
				</FlatButton>
			</span>
		</h2>
	)

	const children = childKeys.map(key => (
		<ExpandableRequirement
			key={key}
			name={key}
			info={((info[key]: any): RequirementType)}
			path={props.path.concat(key)}
			onAddOverride={props.onAddOverride}
			onToggleOverride={props.onToggleOverride}
			onRemoveOverride={props.onRemoveOverride}
		/>
	))

	const overrideButtons = info.message &&
		!info.result && (
			<span className="required-override-buttons button-group">
				<FlatButton
					onClick={ev => props.onRemoveOverride(props.path, ev)}
				>
					Not yet…
				</FlatButton>
				<FlatButton onClick={ev => props.onAddOverride(props.path, ev)}>
					Done!
				</FlatButton>
			</span>
		)

	let className = [
		'requirement',
		extraClasses.join(' '),
		computationClassName,
	].join(' ')

	return (
		<div className={className}>
			{title}
			<div className="contents" hidden={!props.isOpen}>
				{description}
				{message}
				{overrideButtons}
				{filterEl}
				{result}
				{children.length ? (
					<div className="children">{children}</div>
				) : null}
			</div>
		</div>
	)
}

type State = {
	open: boolean,
}

export default class ExpandableRequirement extends Component<Props, State> {
	state = {
		open: true,
	}

	handleToggleOpen = () => {
		this.setState({open: !this.state.open})
	}

	render() {
		return (
			<Requirement
				{...this.props}
				isOpen={this.state.open}
				onToggleOpen={this.handleToggleOpen}
			/>
		)
	}
}
