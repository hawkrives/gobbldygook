import _ from 'lodash'
import Immutable from 'immutable'
import React from 'react/addons'
import {State, Navigation} from 'react-router'

import studentActions from 'app/flux/studentActions'
import RequirementSet from 'app/elements/requirementSet'

let cx = React.addons.classSet

let AreaOfStudy = React.createClass({
	mixins: [State, Navigation],

	propTypes: {
		area: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
			result: React.PropTypes.bool.isRequired,
			progress: React.PropTypes.shape({
				at: React.PropTypes.number.isRequired,
				of: React.PropTypes.number.isRequired,
				word: React.PropTypes.string,
			}).isRequired,
			type: React.PropTypes.string,
			details: React.PropTypes.arrayOf(React.PropTypes.object),
		})
	},

	toggle() {
		this.setState({expanded: !this.state.expanded})
	},

	componentWillReceiveProps(nextProps) {
		this.setState({
			reqSets: this.makeReqSets(),
		})
	},

	componentWillMount() {
		this.setState({
			reqSets: this.makeReqSets(),
		})
	},

	getInitialState() {
		return {
			expanded: false,
			reqSets: this.makeReqSets(),
		}
	},

	makeReqSets() {
		let reqSets = _.map(this.props.area.details, (reqset) =>
				React.createElement(RequirementSet, Object.assign({key: reqset.title}, reqset)))
		return reqSets
	},

	render() {
		// console.log(`render areaOfStudy for ${this.props.area.id}`)

		let header = React.createElement('header',
			{className: 'summary', onClick: this.toggle},
			React.createElement('h1', null, this.props.area.title),
			React.createElement('progress', {
				value: this.props.area.progress.at,
				max: this.props.area.progress.of,
				className: this.props.area.progress.word,
			}))

		let classes = cx({
			'area-of-study': true,
			open: this.state.expanded,
		})

		return React.createElement('div',
			{key: this.props.area.id, className: classes},
			header,
			this.state.expanded ? this.state.reqSets : null)
	},
})

export default AreaOfStudy
