process.on('unhandledRejection', function(reason, p) {
	console.error('Unhandled rejection in', p)
	console.error('Reason:', reason)
})

require('../scripts/edit-node-path')

require('babel-register')
