var fs = require('fs')

var files = fs.readdirSync(__dirname + '/../dist')
var toIgnore = ['.DS_Store']

var exports = files
	.filter(function(f) {return toIgnore.indexOf(f) === -1})
	.map(function(f) {return f.split('.')[0]})
	.reduce(function(string, file) {
		return string + '\t' + file + ': require("./dist/' + file + '"),\n'
	}, '')

var fileAsString = 'module.exports = {\n' + exports + '}\n'

fs.writeFileSync(__dirname + '/../index.js', fileAsString)
