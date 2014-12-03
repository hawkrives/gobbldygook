'use strict';

import * as _ from 'lodash'
import * as React from 'react/addons'

import RequirementSet from './requirementSet.es6'

import getRandomInt from '../helpers/getRandomInt.es6'

var areas = {
	// Degrees
	'd-ba': require('../../mockups/bachelorOfArts.es6').default,
	'd-bm': require('../../mockups/bachelorOfMusic.es6').default,

	// Majors
	'm-csci': require('../../mockups/computerScience.es6').default,
	'm-asian': require('../../mockups/asianStudies.es6').default,
	'm-chem': require('../../mockups/chemistry.es6').default,
	'm-phys': require('../../mockups/physics.es6').default,

	// Concentrations
	'c-asian': require('../../mockups/asianStudiesConcentration.es6').default,
	'c-stat': require('../../mockups/statisticsConcentration.es6').default,
	'c-chin': require('../../mockups/chineseStudiesConcentration.es6').default,
	'c-japan': require('../../mockups/japaneseStudiesConcentration.es6').default,

	// Emphases
}

var getArea = (id) => areas[id]

function findResults(obj) {
	if (_.isArray(obj)) {
		return _(obj)
			.map((val) => findResults(val))
			.flatten()
			.reject(_.isUndefined)
			.value()
	}
	else if (_.isObject(obj)) {
		return _(obj)
			.map((val, key, coll) => {
				if (key === 'result' && !coll.hasOwnProperty('details')) {
					return val
				}
				else if (!(key === 'matches')) {
					return findResults(val)
				}
			})
			.flatten()
			.reject(_.isUndefined)
			.value()
	}
	else if (_.isBoolean(obj)) {
		return obj // not an obj, don't process me
	}
}

let findWordForProgress = (maxProgress, currentProgress) => {
	let progress = currentProgress / maxProgress
	if (progress >= 1)
		return 'hundred'
	else if (progress >= 0.9)
		return 'ninety'
	else if (progress >= 0.8)
		return 'eighty'
	else if (progress >= 0.7)
		return 'seventy'
	else if (progress >= 0.6)
		return 'sixty'
	else if (progress >= 0.5)
		return 'fifty'
	else if (progress >= 0.4)
		return 'forty'
	else if (progress >= 0.3)
		return 'thirty'
	else if (progress >= 0.2)
		return 'twenty'
	else if (progress >= 0.1)
		return 'ten'
	else
		return 'zero'
}

let noResult = (type) => {
	return {
		result: {
			result: false,
			details: [{
				title: type + ' not found!',
				description: 'This ' + type + ' could not be found.'
			}]
		}
	}
}

var AreaOfStudy = React.createClass({
	displayName: 'AreaOfStudy',
	load(props) {
		let area = getArea(props.area.id)

		if (typeof area === 'function') {
			let results = area(this.props.student)
			// console.log('calculated ' + this.props.area.abbr + ' graduation possibility', results)
			this.setState({
				result: results
			})
		}
		else {
			this.setState(noResult(props.area.type))
		}
	},
	getInitialState() {
		return {
			result: {
				result: false,
				details: []
			},
			open: false
		}
	},
	componentWillReceiveProps(nextProps) {
		this.load(nextProps)
	},
	componentDidMount() {
		this.load(this.props)
	},
	toggle() {
		this.setState({open: !this.state.open});
	},
	render() {
		// console.log('area-of-study render')

		var requirementSets = _.map(this.state.result.details, (reqset) => {
			return React.createElement(RequirementSet, _.merge({key: reqset.title}, reqset));
		});

		var results = findResults(this.state.result.details)
		// console.log(this.props.area.title, results, this.state.result.details)
		var currentProgress = _.size(_.compact(results))
		var maxProgress = _.size(results)

		var progressName = findWordForProgress(maxProgress, currentProgress)

		var classes = React.addons.classSet({
			'area-of-study': true,
			open: this.state.open,
		})

		return React.createElement('div',
			{id: this.props.area.id, className: classes},
			React.createElement('div',
				{className: 'summary', onClick: this.toggle},
				React.createElement('h1', null, this.props.area.title),
				React.createElement('progress', {
					value: currentProgress,
					max: maxProgress,
					className: progressName,
				})
			),
			this.state.open ? requirementSets : null
		);
	}
});

export default AreaOfStudy
