var Collection = require('ampersand-rest-collection');
var Requirement = require('./requirement');


module.exports = Collection.extend({
    model: Requirement,
    url: '/api/requirements'
});
