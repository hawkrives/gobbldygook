// @flow

import React from 'react'
import cx from 'classnames'
import {Icon} from '../../components/icon'
import {TopLevelRequirement} from './requirement'
import ProgressBar from '../../components/progress-bar'
import {chevronUp, chevronDown} from '../../icons/ionicons'
import {type EvaluationResult} from '@gob/examine-student'
import {type AreaQuery} from '@gob/object-student'

import './area-of-study.scss'

type Props = {
	isOpen?: boolean,
	style?: {},

	areaOfStudy: AreaQuery,
	error?: ?string,
	examining?: boolean,
	results: ?EvaluationResult,
	onToggleOpen?: Event => mixed,
	onAddOverride?: (Array<string>, Event) => mixed,
	onRemoveOverride?: (Array<string>, Event) => mixed,
	onToggleOverride?: (Array<string>, Event) => mixed,
}

export class AreaOfStudy extends React.Component<Props> {
	render() {
		let {
			isOpen = true,
			results,
			error = null,
			examining = false,
			areaOfStudy,
			onToggleOpen = () => {},
			onAddOverride = () => {},
			onRemoveOverride = () => {},
			onToggleOverride = () => {},
			style,
		} = this.props

		let {name = 'Unknown Area'} = areaOfStudy

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
