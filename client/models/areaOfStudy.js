var _ = require('lodash');
var React = require('react');

var RequirementSet = require("./requirementSet");

var AreaOfStudy = React.createClass({
	render: function() {
		console.log('area-of-study render')

		var areaDetails = []//getAreaOfStudy(this.props.name, this.props.type);

		var requirementSets = _.map(areaDetails.sets, function(reqset) {
			return RequirementSet( {key:reqset.description,
				name: reqset.description,
				needs: reqset.needs,
				count: reqset.count,
				requirements: reqset.reqs,
				courses: this.props.courses});
		}, this);

		return React.DOM.article( {id:areaDetails.id, className:"area-of-study"},
			React.DOM.details(null,
				React.DOM.summary(null, React.DOM.h1(null, areaDetails.title)),
				requirementSets
			)
		);
	}
});

module.exports = AreaOfStudy
