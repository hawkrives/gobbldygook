'use strict';

var _ = require('lodash');
var React = require('react');

var RequirementSet = require('./requirementSet');

var getRandomInt = require('../helpers/getRandomInt')

var areas = {
	// Degrees
	'd-ba': require('../../mockups/bachelor of arts'),
	'd-bm': require('../../mockups/bachelor of music'),

	// Majors
	'm-csci': require('../../mockups/computer science'),
	'm-asian': require('../../mockups/asian studies'),

	// Concentrations

	// Emphases
}

function getArea(id) {
	return areas[id]
}

var AreaOfStudy = React.createClass({
	load: function() {
		var area = getArea(this.props.id)

		if (typeof area === 'function') {
			area(this.props).bind(this).then(function(results) {
				console.log('calculated ' + this.props.abbr + ' graduation possibility', results)
				this.setState({
					result: results
				})
			})
		} else {
			this.setState({
				result: {
					result: false,
					details: [{
						title: this.props.type + ' not found!',
						description: 'This ' + this.props.type + ' could not be found.'
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

		var results = _.chain(this.state.result.details)
			.flatten()
			.toArray()
			.pluck('result')
			.value()

		// TODO: Use the number of requirements, instead of the number of sections.
		// go through everything.
		// grab the value, if the key is not 'result'.
		// if the key is result, and details is undefined, grab it.
		// Theoretically, of course.

		var currentProgress = _.size(_.compact(results))
		var maxProgress = _.size(results)

		return React.DOM.article({id: this.props.id, className: 'area-of-study'},
			React.DOM.details(null,
				React.DOM.summary(null,
					React.DOM.h1(null, this.props.title),
					React.DOM.progress({value: currentProgress, max: maxProgress})
				),
				requirementSets
			)
		);
	}
});

module.exports = AreaOfStudy
