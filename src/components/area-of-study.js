import React, {Component, PropTypes} from 'react'
// import {Link} from 'react-router'
import cx from 'classnames'

import Button from './button'
import Icon from './icon'
import Requirement from './requirement'
import ProgressBar from './progress-bar'

import './area-of-study.scss'

export default class AreaOfStudy extends Component {
	static propTypes = {
		_checked: PropTypes.bool.isRequired,
		_error: PropTypes.string,
		_progress: PropTypes.shape({
			at: PropTypes.number.isRequired,
			of: PropTypes.number.isRequired,
		}),
		addOverride: PropTypes.func.isRequired,
		data: PropTypes.object,
		id: PropTypes.string.isRequired,
		isCustom: PropTypes.bool,
		name: PropTypes.string.isRequired,
		removeArea: PropTypes.func.isRequired,
		removeOverride: PropTypes.func.isRequired,
		result: PropTypes.object.isRequired,
		revision: PropTypes.string.isRequired,
		showCloseButton: PropTypes.bool.isRequired,
		showEditButton: PropTypes.bool.isRequired,
		slug: PropTypes.string,
		studentId: PropTypes.string.isRequired,
		toggleOverride: PropTypes.func.isRequired,
		type: PropTypes.string.isRequired,
	}

	static defaultProps = {
		_progress: {
			word: 'zero',
			at: 0,
			of: 1,
		},
		_error: '',
		_checked: false,
		name: 'Unknown Area',
		type: '???',
		revision: '0000-00',
		result: {},
	}

	constructor() {
		super()
		this.state = {
			open: false,
			confirmRemoval: false,
		}
	}

	startRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: true})
	}

	endRemovalConfirmation = ev => {
		ev.preventDefault()
		this.setState({confirmRemoval: false})
	}

	render() {
		const summary = (
			<div>
				<div className='area--summary-row'>
					<h1 className='area--title'>
						{this.props.slug && !this.props.isCustom
						? <a className='catalog-link'
							href={`http://catalog.stolaf.edu/academic-programs/${this.props.slug}/`}
							target='_blank'
							onClick={ev => ev.stopPropagation()}
							title='View in the St. Olaf Catalog'>
							{this.props.name}
						</a>
						: this.props.name}
					</h1>
					<span className='icons'>
						{this.props.showCloseButton &&
						<Button className='area--remove-button' onClick={this.startRemovalConfirmation}>
							<Icon name='close' />
						</Button>}
						{/*this.props.showEditButton &&
						<Button className='area--edit-button'>
							<Link
								to='/s/${this.props.studentId}/area-editor'
								query={{
									type: this.props.type,
									name: this.props.name,
									revision: this.props.revision,
								}}
								onClick={ev => ev.stopPropagation()}>
								<Icon name='edit' />
							</Link>
						</Button>*/}
						<Icon className='area--open-indicator' name={this.state.open ? 'chevron-up' : 'chevron-down'} />
					</span>
				</div>
				<ProgressBar
					className={cx('area--progress', {error: this.props._error})}
					colorful={true}
					value={this.props._progress.at}
					max={this.props._progress.of}
				/>
			</div>
		)

		const removalConfirmation = (
			<div className='area--confirm-removal'>
				<p>Remove <strong>{this.props.name}</strong>?</p>
				<span className='button-group'>
					<Button className='area--actually-remove-area' onClick={ev => this.props.removeArea({ev, areaId: this.props.id})}>Remove</Button>
					<Button onClick={this.endRemovalConfirmation}>Cancel</Button>
				</span>
			</div>
		)

		let contents = null
		if (this.props._error) {
			contents = <p className='area--error'>{this.props._error} {':('}</p>
		}
		else if (!this.props._checked) {
			contents = <p className='area--loading'>Loading…</p>
		}
		else {
			contents = (<Requirement {...this.props}
				topLevel
				addOverride={this.props.addOverride}
				toggleOverride={this.props.toggleOverride}
				removeOverride={this.props.removeOverride}
				path={[this.props.type, this.props.name]}
			/>)
		}

		return (
			<details className={cx('area', {errored: this.props._error}, {loading: !this.props._checked})}>
				<summary className='area--summary' onClick={() => this.setState(state => ({open: !state.open}))}>
					{this.state.confirmRemoval
						? removalConfirmation
						: summary}
				</summary>
				{this.state.open && !this.state.confirmRemoval && contents}
			</details>
		)
	}
}
