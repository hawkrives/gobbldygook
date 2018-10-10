// @flow
import React, {Component} from 'react'
import cx from 'classnames'
import {isRequirementName} from '@gob/examine-student'

import {Icon} from '../../components/icon'
import {iosBoltOutline, iosBolt} from '../../icons/ionicons'
import Filter from './expression--filter'
import Expression from './expression'
import {FlatButton} from '../../components/button'
import ResultIndicator from './result-indicator'

import './requirement.scss'

type RequirementInfo = {
	computed?: boolean,
	description?: string,
	filter?: Object,
	message?: string,
	result?: Object,
	overridden?: boolean,
	[key: string]: RequirementInfo,
}

type Props = {
	onAddOverride: (string[], Event) => any,
	onRemoveOverride: (string[], Event) => any,
	onToggleOverride: (string[], Event) => any,
	path: string[],
	topLevel?: boolean,
	info: ?RequirementInfo,
	name?: string,
}

type RequirementProps = Props & {
	isOpen?: boolean,
	onToggleOpen: () => any,
}

function Requirement(props: RequirementProps) {
	let info = props.info || {}

	let childKeys = Object.keys(info).filter(isRequirementName)

	let wasEvaluated = info.result && info.result._checked
	let computationClassName = wasEvaluated
		? info.computed
			? 'result-success'
			: 'result-failure'
		: ''
	let status = <ResultIndicator result={info.computed} />

	let extraClasses = [info.overridden ? 'overridden' : '']

	let result = info.result && (
		<div className="result">
			<Expression expr={info.result} ctx={info} />
		</div>
	)

	let message = info.message && <p className="message">{info.message}</p>
	let description = info.description && (
		<p className="description">{info.description}</p>
	)

	let filterEl = info.filter && <Filter expr={info.filter} ctx={info} />

	let title = (
		<h2 className="heading" title={props.name} onClick={props.onToggleOpen}>
			<span className="title">
				<span className="status">{status}</span>
				{props.name}
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

	let children = childKeys.map(key => (
		<ExpandableRequirement
			key={key}
			name={key}
			info={((info[key]: any): RequirementInfo)}
			path={props.path.concat(key)}
			onAddOverride={props.onAddOverride}
			onToggleOverride={props.onToggleOverride}
			onRemoveOverride={props.onRemoveOverride}
		/>
	))

	let overrideButtons = info.message &&
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

	let className = cx(
		'requirement',
		...extraClasses,
		computationClassName,
		props.isOpen ? 'is-open' : 'is-closed',
	)

	return (
		<div className={className}>
			{title}
			{description}
			{message}
			{overrideButtons}
			{filterEl}
			{result}
			{children.length ? (
				<div className="children">{children}</div>
			) : null}
		</div>
	)
}

type State = {
	open: boolean,
}

export default class ExpandableRequirement extends Component<Props, State> {
	state = {
		open: false,
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

export function TopLevelRequirement(props: Props) {
	let info = props.info || {}
	let childKeys = Object.keys(info).filter(isRequirementName)
	let children = childKeys.map(key => (
		<ExpandableRequirement
			key={key}
			name={key}
			info={((info[key]: any): RequirementInfo)}
			path={props.path.concat(key)}
			onAddOverride={props.onAddOverride}
			onToggleOverride={props.onToggleOverride}
			onRemoveOverride={props.onRemoveOverride}
		/>
	))

	return (
		<>
			{info.filter && <Filter expr={info.filter} ctx={info} />}
			{info.result && (
				<div className="result">
					<Expression expr={info.result} ctx={info} />
				</div>
			)}
			{children.length && <div className="children">{children}</div>}
		</>
	)
}
