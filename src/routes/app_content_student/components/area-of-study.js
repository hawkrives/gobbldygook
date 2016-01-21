import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import Button from '../../../components/button'
import Icon from '../../../components/icon'
import Requirement from './requirement'
import ProgressBar from '../../../components/progress-bar'
import compareProps from '../../../helpers/compare-props'

import './area-of-study.scss'

function AreaOfStudy(props) {
	const {
		area,
		isOpen,
		showCloseButton,
		showConfirmRemoval,
	} = props

	const {
		type = '???',
		revision = '0000-00',
		slug,
		isCustom = false,
		name = 'Unknown Area',
		_area: areaDetails,
		_progress: progress,
		_error: error = '',
		_checked: checked = false,
	} = area

	const progressAt = typeof progress === 'object' ? progress.at : 0
	const progressOf = typeof progress === 'object' ? progress.of : 1

	const summary = (
		<div>
			<div className='area--summary-row'>
				<h1 className='area--title'>
					{slug && !isCustom && isOpen
						? <a className='catalog-link'
							href={`http://catalog.stolaf.edu/academic-programs/${slug}/`}
							target='_blank'
							onClick={ev => ev.stopPropagation()}
							title='View in the St. Olaf Catalog'
						>
							{name}
						</a>
						: name}
				</h1>
				<span className='icons'>
					{showCloseButton &&
					<Button className='area--remove-button' onClick={props.onStartRemovalConfirmation}>
						<Icon name='close' />
					</Button>}
					<Icon
						className='area--open-indicator'
						name={isOpen ? 'chevron-up' : 'chevron-down'}
					/>
				</span>
			</div>
			<ProgressBar
				className={cx('area--progress', {error: error})}
				colorful={true}
				value={progressAt}
				max={progressOf}
			/>
		</div>
	)

	const removalConfirmation = (
		<div className='area--confirm-removal'>
			<p>Remove <strong>{name}</strong>?</p>
			<span className='button-group'>
				<Button
					className='area--actually-remove-area'
					onClick={ev => props.onRemoveArea({name, type, revision}, ev)}
				>
					Remove
				</Button>
				<Button onClick={props.onEndRemovalConfirmation}>Cancel</Button>
			</span>
		</div>
	)

	let contents = null
	if (error) {
		contents = <p className='message area--error'>{error} {':('}</p>
	}
	else if (!checked) {
		contents = <p className='message area--loading'>Loading…</p>
	}
	else {
		contents = (
			<Requirement
				{...areaDetails}
				topLevel
				onAddOverride={props.onAddOverride}
				onRemoveOverride={props.onRemoveOverride}
				onToggleOverride={props.onToggleOverride}
				path={[type, name]}
			/>
		)
	}

	return (
		<div className={cx('area', {errored: Boolean(error)}, {loading: !checked})}>
			<div
				className='area--summary'
				onClick={props.onToggleAreaExpansion}
			>
				{showConfirmRemoval
					? removalConfirmation
					: summary}
			</div>
			{isOpen && !showConfirmRemoval && contents}
		</div>
	)
}
AreaOfStudy.propTypes = {
	area: PropTypes.shape({
		_area: PropTypes.object,
		_checked: PropTypes.bool,
		_error: PropTypes.string,
		_progress: PropTypes.shape({
			at: PropTypes.number.isRequired,
			of: PropTypes.number.isRequired,
		}),
		isCustom: PropTypes.bool,
		name: PropTypes.string.isRequired,
		revision: PropTypes.string.isRequired,
		slug: PropTypes.string,
		type: PropTypes.string.isRequired,
	}).isRequired,
	isOpen: PropTypes.bool.isRequired,
	onAddOverride: PropTypes.func.isRequired,
	onEndRemovalConfirmation: PropTypes.func.isRequired,
	onRemoveArea: PropTypes.func.isRequired,
	onRemoveOverride: PropTypes.func.isRequired,
	onStartRemovalConfirmation: PropTypes.func.isRequired,
	onToggleAreaExpansion: PropTypes.func.isRequired,
	onToggleOverride: PropTypes.func.isRequired,
	showCloseButton: PropTypes.bool.isRequired,
	showConfirmRemoval: PropTypes.bool.isRequired,
}

export default class AreaOfStudyContainer extends Component {
	static propTypes = {
		area: PropTypes.object.isRequired,
		onAddOverride: PropTypes.func.isRequired,
		onRemoveArea: PropTypes.func.isRequired,
		onRemoveOverride: PropTypes.func.isRequired,
		onToggleOverride: PropTypes.func.isRequired,
		showCloseButton: PropTypes.bool.isRequired,
		showEditButton: PropTypes.bool.isRequired,
		studentId: PropTypes.string.isRequired,
	};

	state = {
		isOpen: false,
		confirmRemoval: false,
	};

	shouldComponentUpdate(nextProps, nextState) {
		return compareProps(this.props, nextProps) || compareProps(this.state, nextState)
	}

	startRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: true})
	};

	endRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: false})
	};

	toggleAreaExpansion = ev => {
		ev.preventDefault()
		this.setState({isOpen: !this.state.isOpen})
	};

	render() {
		return (
			<AreaOfStudy
				area={this.props.area}
				isOpen={this.state.isOpen}
				onAddOverride={this.props.onAddOverride}
				onEndRemovalConfirmation={this.endRemovalConfirmation}
				onRemoveArea={this.props.onRemoveArea}
				onRemoveOverride={this.props.onRemoveOverride}
				onStartRemovalConfirmation={this.startRemovalConfirmation}
				onToggleAreaExpansion={this.toggleAreaExpansion}
				onToggleOverride={this.props.onToggleOverride}
				showCloseButton={this.props.showCloseButton}
				showConfirmRemoval={this.state.confirmRemoval}
			/>
		)
	}
}
