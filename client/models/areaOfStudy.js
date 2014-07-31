var _ = require('lodash');
var React = require('react');

var RequirementSet = require('./requirementSet');

var getRandomInt = require('../helpers/getRandomInt')

var areas = {
	major: {
		'Computer Science': require('../../mockups/csci'),
		'Asian Studies': require('../../mockups/asian studies')
	},
	degree: {
		'Bachelor of Arts': require('../../mockups/bachelor of music'),
		'Bachelor of Music': require('../../mockups/bachelor of arts')
	},
	concentration: {
		'Computer Science': require('../../mockups/csci'),
		'Asian Studies': require('../../mockups/asian studies')
	}
}

function findType(result, details) {
	if (_.isArray(details)) {
		return 'array'
	}
	else if (_.isUndefined(details) && _.isBoolean(result)) {
		return 'boolean'
	}
	else if (_.isPlainObject(details)) {
		if (_.every(details, _.isBoolean)) {
			return 'object/boolean'
		}
		else if (_.some(details, _.isNumber)) {
			return 'object/number'
		}
	}
	else {
		return null
	}
}

var AreaOfStudy = React.createClass({
	load: function() {
		var type = this.props.type
		var title = this.props.title

		var area = areas[type][title]

		if (typeof area === 'function') {
			area(this.props).bind(this)
				.then(function(results) {
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
						description: 'This ' + this.props.type + ' could not be found.',
						result: false
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
			return RequirementSet({
				key: reqset.title,
				title: reqset.title,
				description: reqset.description,
				type: findType(reqset.result, reqset.details),
				result: reqset.result,
				details: reqset.details || null
			});
		}, this);

		var results = _.chain(this.state.result.details)
			.flatten()
			.toArray()
			.pluck('result')
			.value()

		// TODO: Use the number of requirements, instead of the number of sections.

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
