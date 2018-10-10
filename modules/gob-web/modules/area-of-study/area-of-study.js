// @flow

import React from 'react'
import cx from 'classnames'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import {TopLevelRequirement} from './requirement'
import ProgressBar from '../../components/progress-bar'
import {close, chevronUp, chevronDown} from '../../icons/ionicons'
import {type EvaluationResult} from '@gob/examine-student'
import {type AreaQuery} from '@gob/object-student'

import './area-of-study.scss'

type Props = {
	showCloseButton?: boolean,
	showEditButton?: boolean,
	isOpen?: boolean,
	showConfirmRemoval?: boolean,
	style?: {},

	areaOfStudy: AreaQuery,
	error?: ?string,
	examining?: boolean,
	results: ?EvaluationResult,
	onToggleOpen?: Event => mixed,
	onRemove?: Event => mixed,
	onAddOverride?: (Array<string>, Event) => mixed,
	onRemoveOverride?: (Array<string>, Event) => mixed,
	onToggleOverride?: (Array<string>, Event) => mixed,
	onRemovalStart?: Event => mixed,
	onRemovalCancel?: Event => mixed,
}

export class AreaOfStudy extends React.Component<Props> {
	render() {
		let {
			isOpen = true,
			showConfirmRemoval = false,
			results,
			error = null,
			examining = false,
			areaOfStudy,
			onToggleOpen = () => {},
			showCloseButton = false,
			onRemovalStart = () => {},
			onRemove = () => {},
			onRemovalCancel = () => {},
			onAddOverride = () => {},
			onRemoveOverride = () => {},
			onToggleOverride = () => {},
			style,
		} = this.props

		let {name = 'Unknown Area'} = areaOfStudy

		// TODO: fix slugs
		// let slug = ''
		// if (this.state.results) {
		// 	slug = this.state.results.slug
		// }

		let progressAt = 0
		let progressOf = 1

		if (results && results.progress) {
			progressAt = results.progress.at
			progressOf = results.progress.of
		}

		let className = cx('area', {
			errored: Boolean(error),
			loading: examining,
		})

		return (
			<div className={className} style={style}>
				<div className="area--summary" onClick={onToggleOpen}>
					<div className="area--summary-row">
						<h1 className="area--title">
							<CatalogLink slug={'' /*slug*/} name={name} />
						</h1>
						<span className="icons">
							{showCloseButton && (
								<FlatButton
									className="area--remove-button"
									onClick={onRemovalStart}
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
						className={cx('area--progress', {
							error: Boolean(error),
						})}
						colorful={true}
						value={progressAt}
						max={progressOf}
					/>
				</div>

				{showConfirmRemoval && (
					<RemovalConfirmation
						name={name}
						onRemove={onRemove}
						onCancel={onRemovalCancel}
					/>
				)}

				{error && (
					<p className="message area--error">
						{error} {':('}
					</p>
				)}

				{isOpen && examining ? (
					<p className="message area--loading">Loading…</p>
				) : null}

				{isOpen ? (
					<TopLevelRequirement
						info={(results: any)}
						onAddOverride={onAddOverride}
						onRemoveOverride={onRemoveOverride}
						onToggleOverride={onToggleOverride}
						path={[areaOfStudy.type, name]}
					/>
				) : null}
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

const RemovalConfirmation = (props: {
	name: string,
	onRemove: Event => mixed,
	onCancel: Event => mixed,
}) => {
	let {name, onRemove, onCancel} = props
	return (
		<div className="area--confirm-removal">
			<p>
				Remove <strong>{name}</strong>?
			</p>
			<span className="button-group">
				<FlatButton
					className="area--actually-remove-area"
					onClick={onRemove}
				>
					Remove
				</FlatButton>
				<FlatButton onClick={onCancel}>Cancel</FlatButton>
			</span>
		</div>
	)
}
