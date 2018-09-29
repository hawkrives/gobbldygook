// @flow

import React, {Component} from 'react'
import ScreenToolbar from './screen-toolbar'

export default class DriveLinkScreen extends Component<void> {
	render() {
		return (
			<div>
				<header className="header">
					<h1>Link to Google Drive</h1>
				</header>

				<p>Unfortunately, this functionality has not yet been built.</p>

				<ScreenToolbar onBack={() => {}} onNext={() => {}} />
			</div>
		)
	}
}
