var Collection = require('ampersand-rest-collection');
var Student = require('./student');


module.exports = Collection.extend({
    model: Student,
    url: '/api/students'
});
