// @flow

import * as React from 'react'
import {Router, Link} from '@reach/router'
import {RaisedButton} from '../../components/button'
import Loadable from 'react-loadable'
import {LoadingComponent} from '../../components/loading-comp'

let NotFound = () => <h1>404 Not Found</h1>

const Editor = Loadable({
	loader: () => import('../../modules/area-editor').then(m => m.AreaEditor),
	loading: LoadingComponent,
})

export default function() {
	return (
		<div>
			<header>
				<RaisedButton as={Link} to="/" style={{margin: '1rem'}}>
					Home
				</RaisedButton>

				<p style={{margin: 0, display: 'inline', fontWeight: 'bold'}}>
					Area of Study Editor
				</p>
			</header>

			<Router>
				<NotFound default />
				<Editor path="/" />
			</Router>
		</div>
	)
}

Editor.preload()
