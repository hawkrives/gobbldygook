import * as _ from 'lodash'
import * as Immutable from 'immutable'
import * as React from 'react/addons'
import {State, Navigation} from 'react-router'

import RequirementSet from '../elements/requirementSet'

let cx = React.addons.classSet

let AreaOfStudy = React.createClass({
	mixins: [State, Navigation],

	toggle() {
		this.setState({expanded: !this.state.expanded})

		let query = this.getQuery()
		let sections = Immutable.Set(query.sections ? query.sections.split(',') : [])

		if (this.state.expanded) {
			sections = sections.delete(this.props.area.id)
		}
		else {
			sections = sections.add(this.props.area.id)
		}

		query.sections = sections.join(',')

		if (!query.sections.length) {
			delete query.sections
		}

		this.transitionTo('student', {id: this.getParams().id}, query)
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.initialExpansion !== undefined)
			this.setState({expanded: nextProps.initialExpansion})
	},

	getInitialState() {
		return { expanded: this.props.initialExpansion }
	},

	getDefaultProps() {
		return { initialExpansion: false }
	},

	render() {
		// console.log(`render areaOfStudy for ${this.props.area.id}`)

		let requirementSets = null;
		if (this.state.expanded)
			requirementSets = _.map(this.props.area.details, (reqset) =>
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
			open: this.state.expanded,
		})

		return React.createElement('div',
			{key: this.props.area.id, className: classes},
			header,
			requirementSets)
	},
})

export default AreaOfStudy
