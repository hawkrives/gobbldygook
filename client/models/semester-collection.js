var Collection = require('ampersand-rest-collection');
var Semester = require('./semester');


module.exports = Collection.extend({
    model: Semester,
    url: '/api/semester'
});
