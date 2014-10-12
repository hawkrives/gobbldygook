'use strict';

var _ = require('lodash');
var React = require('react');

var RequirementSet = require('./requirementSet');

var getRandomInt = require('../helpers/getRandomInt')

var areas = {
	// Degrees
	'd-ba': require('../../mockups/bachelorOfArts'),
	'd-bm': require('../../mockups/bachelorOfMusic'),

	// Majors
	'm-csci': require('../../mockups/computerScience'),
	'm-asian': require('../../mockups/asianStudies'),

	// Concentrations

	// Emphases
}

function getArea(id) {
	return areas[id]
}

function findResults(obj) {
	if (_.isArray(obj)) {
		return _.chain(obj)
			.map(function(val, idx, coll) {
				return findResults(val)
			})
			.flatten()
			.reject(_.isUndefined)
			.value()
	}
	else if (_.isObject(obj)) {
		return _.chain(obj)
			.map(function(val, key, coll) {
				if (key === 'result' && !coll.hasOwnProperty('details')) {
					return val
				} else {
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

var AreaOfStudy = React.createClass({
	load: function() {
		var area = getArea(this.props.area.id)

		if (typeof area === 'function') {
			area(this.props.student).bind(this).then(function(results) {
				console.log('calculated ' + this.props.area.abbr + ' graduation possibility', results)
				this.setState({
					result: results
				})
			})
		} else {
			this.setState({
				result: {
					result: false,
					details: [{
						title: this.props.area.type + ' not found!',
						description: 'This ' + this.props.area.type + ' could not be found.'
					}]
				}
			})
		}
	},
	getInitialState: function() {
		return {
			result: {
				result: false,
				details: []
			}
		}
	},
	componentWillReceiveProps: function() {
		this.load()
	},
	componentDidMount: function() {
		this.load()
	},
	render: function() {
		// console.log('area-of-study render')

		var requirementSets = _.map(this.state.result.details, function(reqset) {
			return RequirementSet(_.merge({key: reqset.title}, reqset));
		}, this);

		var results = findResults(this.state.result.details)
		console.log(this.props.area.title, results)
		var currentProgress = _.size(_.compact(results))
		var maxProgress = _.size(results)

		return React.DOM.article({id: this.props.area.id, className: 'area-of-study'},
			React.DOM.details(null,
				React.DOM.summary(null,
					React.DOM.h1(null, this.props.area.title),
					React.DOM.progress({value: currentProgress, max: maxProgress})
				),
				requirementSets
			)
		);
	}
});

module.exports = AreaOfStudy
