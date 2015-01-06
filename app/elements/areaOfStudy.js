import * as _ from 'lodash'
import * as Immutable from 'immutable'
import * as React from 'react/addons'
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

		let sections = Immutable.Set(this.props.student.settings.get('expanded-sections') || [])
		if (this.state.expanded) {
			sections = sections.delete(this.props.area.id)
		}
		else {
			sections = sections.add(this.props.area.id)
		}

		studentActions.changeSetting(this.props.student.id, 'expanded-sections', sections.toArray())
	},

	checkForExpansion(props) {
		let sections = props.student.settings.get('expanded-sections')
		if (sections)
			return sections.indexOf(this.props.area.id) >= 0
		return false
	},

	componentWillReceiveProps(nextProps) {
		this.setState({ expanded: this.checkForExpansion(this.props) })
	},

	componentWillMount() {
		this.setState({ expanded: this.checkForExpansion(this.props) })
	},

	getInitialState() {
		return { expanded: this.checkForExpansion(this.props) }
	},

	render() {
		// console.log(`render areaOfStudy for ${this.props.area.id}`)

		let requirementSets = null
		if (this.state.expanded)
			requirementSets = _.map(this.props.area.details, (reqset) =>
				React.createElement(RequirementSet, _.extend({key: reqset.title}, reqset)))

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
			requirementSets)
	},
})

export default AreaOfStudy
