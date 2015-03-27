import React from 'react'
import map from 'lodash/collection/map'
import RequirementSet from './requirementSet'
import cx from 'classnames'

let makeRequirementSets = (props) => {
	if (!props.areaResult) {
		return []
	}

	let reqSets = map(props.areaResult.details, (reqset) =>
		<RequirementSet key={reqset.title} {...reqset} />)

	return reqSets
}

class AreaOfStudy extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			expanded: false,
			reqSets: makeRequirementSets(props),
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({reqSets: makeRequirementSets(nextProps)})
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	render() {
		console.log('AreaOfStudy#render', this.props.area.id)

		let progressProps = this.props.areaResult ? {
			className: this.props.areaResult.progress.word,
			value: this.props.areaResult.progress.at,
			max: this.props.areaResult.progress.of,
		} : {}

		let reqSets = this.state.reqSets

		let header = <summary className='summary'>
			<h1>{this.props.area.title}</h1>
			<progress {...progressProps} />
		</summary>

		let classes = cx({
			'area-of-study': true,
			loading: !this.props.areaResult,
		})

		return <details className={classes}>
			{header}
			{reqSets}
		</details>
	}
}

AreaOfStudy.propTypes = {
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
}

export default AreaOfStudy
