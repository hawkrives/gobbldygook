import React from 'react/addons'
import {map} from 'lodash'
import RequirementSet from './requirementSet'

let cx = React.addons.classSet

let makeRequirementSets = (props) => {
	if (!props.areaResult)
		return []

	let reqSets = map(props.areaResult.details, (reqset) =>
		React.createElement(RequirementSet,
			Object.assign({key: reqset.title}, reqset)))

	return reqSets
}

let AreaOfStudy = React.createClass({
	propTypes: {
		area: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
			type: React.PropTypes.string,
		}).isRequired,
		areaResult: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			title: React.PropTypes.string.isRequired,
			result: React.PropTypes.bool.isRequired,
			type: React.PropTypes.string,
			progress: React.PropTypes.shape({
				at: React.PropTypes.number.isRequired,
				of: React.PropTypes.number.isRequired,
				word: React.PropTypes.string,
			}).isRequired,
			details: React.PropTypes.arrayOf(React.PropTypes.object),
		}),
	},

	toggle() {
		if (this.props.areaResult)
			this.setState({expanded: !this.state.expanded})
	},

	componentWillReceiveProps(nextProps) {
		this.setState({reqSets: makeRequirementSets(nextProps)})
	},

	componentWillMount() {
		this.setState({reqSets: makeRequirementSets(this.props)})
	},

	getInitialState() {
		return {
			expanded: false,
			reqSets: makeRequirementSets(this.props),
		}
	},

	render() {
		// console.log(`render areaOfStudy for ${this.props.area.id}`)

		let progressProps = this.props.areaResult ? {
				className: this.props.areaResult.progress.word,
				value: this.props.areaResult.progress.at,
				max: this.props.areaResult.progress.of,
		} : {}

		let reqSets = this.state.reqSets

		let header = React.createElement('summary',
			{className: 'summary'},
			React.createElement('h1', null, this.props.area.title),
			React.createElement('progress', progressProps))

		let classes = cx({
			'area-of-study': true,
			loading: !this.props.areaResult,
		})

		return React.createElement('details',
			{className: classes},
			header,
			reqSets)
	},
})

export default AreaOfStudy
