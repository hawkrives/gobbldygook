import React, {PropTypes, Component} from 'react'
import filter from 'lodash/filter'
import keys from 'lodash/keys'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import cx from 'classnames'

import isRequirementName from '../../../area-tools/is-requirement-name'

import Filter from './expression--filter'
import Expression from './expression'
import Button from '../../../components/button'
import ResultIndicator from './result-indicator'

import styles from './requirement.scss'
console.log(styles)

// function getResultOfRequirement(requirements) {
// 	return requirementTitle => requirements[requirementTitle].computed ? 'A' : 'B'
// }

export function Requirement(props) {
	const {
		topLevel = false,
	} = props
	const childKeys = filter(keys(props), isRequirementName)

	const wasEvaluated = props.result && props.result._checked
	const computationClassName = wasEvaluated ? props.computed ? 'result-success' : 'result-failure' : ''
	const status = <ResultIndicator result={props.computed} />

	const extraClasses = [props.overridden ? 'overridden' : '']

	const result = props.result && (
		<div className={styles.result}>
			<Expression expr={props.result} ctx={props} />
		</div>
	)

	const message = props.message &&
		<p className={styles.message}>{props.message}</p>
	const description = props.description &&
		<p className={styles.description}>{props.description}</p>

	const filterEl = props.filter && (
		<div className={styles.filter}>
			Filter:
			<Filter expr={props.filter} ctx={props} />
		</div>
	)

	const title = !topLevel && (
		<h2 className={styles.heading} title={props.name} onClick={props.onToggleOpen}>
			<span className={styles.title}>
				{` ${props.name}`}
				<span className={styles.status}>{status}</span>
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
		<span className={`${styles['override-buttons']} button-group`}>
			<Button onClick={ev => props.onRemoveOverride(props.path, ev)} type='flat'>Not yet…</Button>
			<Button onClick={ev => props.onAddOverride(props.path, ev)} type='flat'>Done!</Button>
		</span>
	)

	let className = [
		styles.requirement,
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
				? <div className='children'>{children}</div>
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
		this.setState({open: !this.state.open})
	};

	render() {
		return <Requirement {...this.props} isOpen={this.state.open} onToggleOpen={this.handleToggleOpen} />
	}
}
