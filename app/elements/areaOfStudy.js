import * as _ from 'lodash'
import * as React from 'react/addons'

import RequirementSet from 'elements/requirementSet'

let cx = React.addons.classSet

let AreaOfStudy = React.createClass({
	toggle() {
		this.setState({open: !this.state.open});
	},

	getInitialState() {
		return { open: false }
	},

	render() {
		// console.log(`render areaOfStudy for ${this.props.area.id}`)

		let requirementSets = null;
		if (this.state.open)
			requirementSets = _.map(this.props.area.result.details, (reqset) =>
				React.createElement(RequirementSet, _.extend({key: reqset.title}, reqset)));

		let header = React.createElement('header',
			{className: 'summary', onClick: this.toggle},
			React.createElement('h1', null, this.props.area.title),
			React.createElement('progress', {
				value: this.props.area.progress.at,
				max: this.props.area.progress.of,
				className: this.props.area.progress.word,
			}));

		let classes = cx({
			'area-of-study': true,
			open: this.state.open,
		})

		return React.createElement('div', {key: this.props.area.id, className: classes}, header, requirementSets)
	},
})

export default AreaOfStudy
