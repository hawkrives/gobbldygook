import map from 'lodash/collection/map'
import React from 'react/addons'
let cx = React.addons.classSet
let {PropTypes} = React

let SomeArrayRequirement = React.createClass({
	propTypes: {
		result: PropTypes.bool.isRequired,
		details: PropTypes.shape({
			has: PropTypes.number.isRequired,
			needs: PropTypes.oneOfType([
				PropTypes.number,
				PropTypes.string,
			]).isRequired,
			word: PropTypes.string,
			from: PropTypes.arrayOf(PropTypes.shape({
				title: PropTypes.string.isRequired,
				result: PropTypes.bool.isRequired,
				abbr: PropTypes.string,
			})).isRequired,
		}),
	},

	render() {
		let overview = null
		if (this.props.details.has || this.props.details.needs || this.props.details.word) {
			let overviewClasses = cx({
				requirement: true,
				completed: this.props.result,
				incomplete: !this.props.result,
			})
			overview = <span className={overviewClasses}>
				{this.props.details.has}
				{this.props.details.word || ' of '}
				{this.props.details.needs}
			</span>
		}

		return <div className='requirement-result requirement-result-some-array'>
			{overview}
			<ul className='requirement-detail-list'>
				{map(this.props.details.from, (req) =>
					<li key={req.title}
						title={req.title}
						className={cx({
							requirement: true,
							completed: req.result,
							nope: !req.result,
						})}>
						{req.abbr || req.title}
					</li>
				)}
			</ul>
		</div>
	},
})

export default SomeArrayRequirement
