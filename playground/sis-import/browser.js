import 'isomorphic-fetch'
import getStudentInfo from '../../src/helpers/import-student.js'

getStudentInfo()
	.then(res => {
		console.log(res)
	})
	.catch(err => {
		console.error(err)
	})
