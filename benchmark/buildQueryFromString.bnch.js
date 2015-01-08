require('6to5-core/register')
var buildQueryFromString = require('app/helpers/queryStuff')

suite('buildQueryFromString', function() {
	bench('builds a query string with multiple keys into a query object', function() {
		var query = 'dept: Computer Science  dept: Asian Studies  name: Parallel  level: 300  year: $OR year:2013 year: 2014'

		buildQueryFromString(query)
	})

	bench('builds a query string with variable-case keys into a query object', function() {
		var query = 'dept: ASIAN  Dept: Religion  title: "Japan*"  LEVEL: 200  year: 2014  semester: $OR  semester: 3  semester: 1'

		buildQueryFromString(query)
	})

	bench('builds a query string even with somewhat unconventional input', function() {
		var query = 'department: American Conversations  name: Independence  year: 2014  time: Tuesdays after 12'

		buildQueryFromString(query)
	})

	bench('builds a query string while deduplicating synonyms of keys', function() {
		var query = 'ges: $AND  geneds: history of western culture gened: HBS  semester: Spring  year: 2014'

		buildQueryFromString(query)
	})

	bench('builds a query string even with no keys', function() {
		var query = 'History of Asia'

		buildQueryFromString(query)
	})
})
