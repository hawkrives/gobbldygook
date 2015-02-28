import map from 'lodash/collection/map'
import React from 'react'
import cx from 'classnames'
let {PropTypes} = React

let BooleanArrayRequirement = React.createClass({
	propTypes: {
		details: PropTypes.arrayOf(PropTypes.shape({
			result: PropTypes.bool.isRequired,
			title: PropTypes.string.isRequired,
			abbr: PropTypes.string,
		})).isRequired,
	},

	render() {
		return <div className='requirement-result requirement-result-boolean-array'>
			<ul className='requirement-detail-list'>
				{map(this.props.details, (req) =>
					<li key={req.title}
						title={`${req.title}: ${(req.result ? 'Completed.' : 'Incomplete!')}`}
						className={cx({
							requirement: true,
							completed: req.result,
							incomplete: !req.result,
						})}>
						{req.abbr || req.title}
					</li>
				)}
			</ul>
		</div>
	},
})

export default BooleanArrayRequirement
