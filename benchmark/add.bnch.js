require('6to5-core/register')
var add = require('app/helpers/add')

suite('add', function() {
	bench('adding 1 and 2', function() {
		add(1, 2)
	})
})
