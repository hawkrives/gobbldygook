import React, { PropTypes, Component } from 'react'
import filter from 'lodash/filter'
import keys from 'lodash/keys'
import map from 'lodash/map'

import { isRequirementName } from 'modules/core/examine-student'

import Icon from 'modules/web/components/icon'
import { iosBoltOutline, iosBolt } from 'modules/web/icons/ionicons'
import Filter from './expression--filter'
import Expression from './expression'
import Button from 'modules/web/components/button'
import ResultIndicator from './result-indicator'

import './requirement.scss'

export function Requirement(props) {
	const {
		topLevel = false,
	} = props
	const childKeys = filter(keys(props), isRequirementName)

	const wasEvaluated = props.result && props.result._checked
	const computationClassName = wasEvaluated ? props.computed ? 'result-success' : 'result-failure' : ''
	const status = <ResultIndicator result={props.computed} />

	const extraClasses = [ props.overridden ? 'overridden' : '' ]

	const result = props.result && (
		<div className="result">
			<Expression expr={props.result} ctx={props} />
		</div>
	)

	const message = props.message &&
		<p className="message">{props.message}</p>
	const description = props.description &&
		<p className="description">{props.description}</p>

	const filterEl = props.filter && (
		<div className="filter">
			Filter: <Filter expr={props.filter} ctx={props} />
		</div>
	)

	const title = !topLevel && (
		<h2 className="heading" title={props.name} onClick={props.onToggleOpen}>
			<span className="title">
				{' '}{props.name}
				<span className="status">{status}</span>
			</span>
			<span className="manual-override">
				<span className="overridden-msg">{props.overridden ? '(Overridden) ' : ''}</span>
				<Button title={`${props.overridden ? 'Remove' : 'Apply'} a manual override to this requirement`} onClick={ev => props.onToggleOverride(props.path, ev)} type="flat">
					<Icon>{props.overridden ? iosBolt : iosBoltOutline}</Icon>
				</Button>
			</span>
		</h2>
	)

	const children = map(childKeys, key =>
		<ExpandableRequirement key={key}
			name={key}
			{...props[key]}
			path={props.path.concat(key)}
			onAddOverride={props.onAddOverride}
			onToggleOverride={props.onToggleOverride}
			onRemoveOverride={props.onRemoveOverride}
		/>)

	const overrideButtons = (props.message && !props.result) && (
		<span className="required-override-buttons button-group">
			<Button onClick={ev => props.onRemoveOverride(props.path, ev)} type="flat">Not yet…</Button>
			<Button onClick={ev => props.onAddOverride(props.path, ev)} type="flat">Done!</Button>
		</span>
	)

	let className = [
		'requirement',
		extraClasses.join(' '),
		computationClassName,
		props.isOpen ? 'is-open' : 'is-closed',
	].join(' ')

	return (
		<div className={className}>
			{title}
			{description}
			{message}
			{overrideButtons}
			{filterEl}
			{result}
			{children.length
				? <div className="children">{children}</div>
				: null}
		</div>
	)
}
Requirement.propTypes = {
	computed: PropTypes.bool,
	description: PropTypes.string,
	filter: PropTypes.object,
	isOpen: PropTypes.bool,
	message: PropTypes.string,
	name: PropTypes.string,
	onAddOverride: PropTypes.func.isRequired,
	onRemoveOverride: PropTypes.func.isRequired,
	onToggleOpen: PropTypes.func.isRequired,
	onToggleOverride: PropTypes.func.isRequired,
	overridden: PropTypes.bool,
	path: PropTypes.array.isRequired,
	result: PropTypes.object,
	topLevel: PropTypes.bool,
}
Requirement.defaultProps = {
	onToggleOpen: () => {},
}

export default class ExpandableRequirement extends Component {
	state = {
		open: true,
	};

	handleToggleOpen = () => {
		this.setState({ open: !this.state.open })
	};

	render() {
		return <Requirement {...this.props} isOpen={this.state.open} onToggleOpen={this.handleToggleOpen} />
	}
}
