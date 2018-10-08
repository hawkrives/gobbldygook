// @flow

import * as React from 'react'
import {Router} from '@reach/router'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'

const StudentPicker = Loadable({
	loader: () => import('../../modules/student-picker'),
	loading: LoadingComponent,
})

export default function() {
	return (
		<>
			<StudentPicker />
		</>
	)
}

StudentPicker.preload()
