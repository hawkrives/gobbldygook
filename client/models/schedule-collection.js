var Collection = require('ampersand-rest-collection');
var Schedule = require('./schedule');


module.exports = Collection.extend({
    model: Schedule,
    url: '/api/schedules'
});
