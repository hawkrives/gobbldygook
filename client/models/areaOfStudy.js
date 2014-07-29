var _ = require('lodash');
var React = require('react');

var RequirementSet = require('./requirementSet');

var getRandomInt = require('../helpers/getRandomInt')

var areas = {
	major: {
		'Computer Science': require('../../mockups/demo_csci_major'),
		'Asian Studies': require('../../mockups/demo_major')
	},
	degree: {
		'Bachelor of Arts': require('../helpers/checkElegibilityForGraduation'),
		'Bachelor of Music': require('../helpers/checkElegibilityForGraduation')
	},
	concentration: {
		'Computer Science': require('../../mockups/demo_csci_major'),
		'Asian Studies': require('../../mockups/demo_major')
	}
}

var AreaOfStudy = React.createClass({
	render: function() {

		var areaDetails = this.props;//getAreaOfStudy(this.props.name, this.props.type);
		// console.log('area-of-study render')

		var requirementSets = _.map(areaDetails.sets, function(reqset) {
			return RequirementSet({
				key: reqset.description,
				name: reqset.description,
				needs: reqset.needs,
				count: reqset.count,
				requirements: reqset.reqs,
				courses: this.props.courses
			});
		}, this);

		return React.DOM.article({id: areaDetails.id, className: 'area-of-study'},
			React.DOM.details(null,
				React.DOM.summary(null,
					React.DOM.h1(null, areaDetails.title),
					React.DOM.progress({value: getRandomInt(0, 100), max: 100})
				),
				requirementSets
			)
		);
	}
});

module.exports = AreaOfStudy
