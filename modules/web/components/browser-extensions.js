// @flow
import React from 'react'

import {
	installOperaExtension,
	installChromeExtension,
	installFirefoxExtension,
} from 'modules/web/helpers/extension-helpers'

import './browser-extensions.scss'

export class BrowserExtensionsComponent extends React.Component {
	state = {
		extensionInstalled: false,
		operaInstallState: false,
		chromeInstallState: false,
		firefoxInstallState: false,
		safariInstallState: false,
		edgeInstallState: false,
	}

	componentWillMount() {
		this.checkExtensionStatus()
	}


	checkExtensionStatus = () => {
		if (global.gobbldygook_extension >= '1.0.0') {
			this.setState({extensionInstalled: true})
		}
	}

	installChromeExtension = () => {
		installChromeExtension()
			.then(() => this.setState({chromeInstallState: true}))
			.reject(err => this.setState({chromeInstallState: err}))
	}

	installFirefoxExtension = () => {
		installFirefoxExtension()
			.then(() => this.setState({firefoxInstallState: true}))
			.reject(err => this.setState({firefoxInstallState: err}))
	}

	installOperaExtension = () => {
		installOperaExtension()
			.then(() => this.setState({operaInstallState: true}))
			.reject(err => this.setState({operaInstallState: err}))
	}

	installSafariExtension = () => {

	}

	installEdgeExtension = () => {

	}

	render() {
		const chromeLink = <a onClick={this.installChromeExtension}>Chrome</a>

		return (
			<div>
				<p>
					Gobbldygook uses a browser extension to import your data from the SIS.
					Once you have imported your student, you don't need the extension anymore.
				</p>
			</div>
		)
	}
}
