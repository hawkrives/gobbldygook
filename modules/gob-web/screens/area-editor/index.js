// @flow

import * as React from 'react'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'
import {Router} from '@reach/router'

let NotFound = () => <h1>404 Not Found</h1>

const Editor = Loadable({
	loader: () => import('../../modules/area-editor').then(m => m.Editor),
	loading: LoadingComponent,
})

export default function() {
	return (
		<div>
			<Router>
				<NotFound default />
				<Editor path="/" />
			</Router>
		</div>
	)
}

Editor.preload()
