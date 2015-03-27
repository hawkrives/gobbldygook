import map from 'lodash/collection/map'
import React from 'react'
import cx from 'classnames'
let {PropTypes} = React

let NumberObjectRequirement = React.createClass({
	propTypes: {
		result: PropTypes.bool.isRequired,
		details: PropTypes.shape({
			has: PropTypes.number.isRequired,
			needs: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string,
			]).isRequired,
			matches: PropTypes.arrayOf(PropTypes.shape({
				clbid: PropTypes.number.isRequired,
				deptnum: PropTypes.string.isRequired,
			})).isRequired,
		}).isRequired,
	},

	render() {
		console.log('NumberObjectRequirement#render')
		return <div className='requirement-result requirement-result-object-number'>
			<span className={cx({
					requirement: true,
					completed: this.props.result,
					incomplete: !this.props.result,
				})}>
				{`${this.props.details.has} of ${this.props.details.needs}`}
			</span>
			<ul className='requirement-detail-list'>
				{map(this.props.details.matches, (match) =>
					<li key={match.clbid} className='match'>{match.deptnum}</li>
				)}
			</ul>
		</div>
	},
})

export default NumberObjectRequirement
