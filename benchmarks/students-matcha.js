require('babel/register')
var evaluate = require('../src/lib/evaluate')
var includes = require('lodash/collection/includes')
var fs = require('graceful-fs')
var junk = require('junk')
var loadArea = require('../bin/load-area')

function loadStudents(dir) {
    return fs.readdirSync(dir)
        .filter(function(name) {return !includes(name, '.ip')})
        .filter(junk.not)
        .map(function(path) {return dir + path})
        .map(function(path) {return fs.readFileSync(path, 'utf-8')})
        .map(JSON.parse)
}

suite('student evaluation', function() {
    loadStudents('./test/example-students/')
        .forEach(function(student) {
            var courses = student.courses || []
            var overrides = student.overrides || {}
            var areas = student.areas || []

            areas.forEach(function(areaInfo) {
                var areaData = loadArea(areaInfo)
                bench('the ' + areaInfo.name + ' ' + areaInfo.type + ' (' + areaInfo.revision + ')', function() {
                    evaluate({courses: courses, overrides: overrides}, areaData)
                })
            })
        })
})
