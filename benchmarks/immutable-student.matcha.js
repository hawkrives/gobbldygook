require('babel/register')
var student = require('../src/models/student')

suite('immutable students', function() {
    bench('creation', function() {
        new student()
    })

    bench('creation from object', function() {
        new student({id: 1})
    })
})
