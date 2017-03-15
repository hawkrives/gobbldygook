'use strict'
process.on('unhandledRejection', function(reason, p) {
    console.error('Unhandled rejection in', p)
    console.error('Reason:', reason)
})

require('babel-register')
