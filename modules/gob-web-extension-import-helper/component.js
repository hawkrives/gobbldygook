// @flow
import React from 'react'
import styled from 'styled-components'
import {interpose} from '@gob/lib'
import brwsr from 'brwsr'

import {installExtension as installChrome} from './chrome'
import {installExtension as installFirefox} from './firefox'
import {installExtension as installOpera} from './opera'

const Button = styled.button`
	display: inline-block;
`

type ButtonProps = {
	onClick: (SyntheticInputEvent<HTMLButtonElement>) => any,
	browserName: string,
	disabled?: boolean,
}

function BrowserButton({onClick, browserName, disabled}: ButtonProps) {
	return (
		<Button disabled={disabled} onClick={onClick}>
			{browserName}
		</Button>
	)
}

type Props = {
	onInstall: () => any,
}

type State = {
	installError: ?Error,
	installAttempted: boolean,
}

export class BrowserExtensionsComponent extends React.Component<Props, State> {
	state = {
		installAttempted: false,
		installError: null,
	}

	checkExtensionStatus = () => {
		if (global.gobbldygook_extension >= '1.0.0') {
			return true
		}
		return false
	}

	installChromeExtension = (ev: SyntheticEvent<>) => {
		ev.preventDefault()
		ev.stopPropagation()

		installChrome()
			.then(this.installSuccess)
			.catch(this.installFailure)
	}

	installFirefoxExtension = (ev: SyntheticEvent<>) => {
		ev.preventDefault()
		ev.stopPropagation()

		installFirefox()
			.then(this.installSuccess)
			.catch(this.installFailure)
	}

	installOperaExtension = (ev: SyntheticEvent<>) => {
		ev.preventDefault()
		ev.stopPropagation()

		installOpera()
			.then(this.installSuccess)
			.catch(this.installFailure)
	}

	// eslint-disable-next-line no-unused-vars
	installSafariExtension = (ev: SyntheticEvent<>) => {}

	// eslint-disable-next-line no-unused-vars
	installEdgeExtension = (ev: SyntheticEvent<>) => {}

	installSuccess = () => {
		this.setState({installAttempted: true})
		this.props.onInstall()
	}

	installFailure = (err: Error) => {
		this.setState({installError: err, installAttempted: true})
	}

	detectBrowser() {
		return brwsr()
	}

	flavorText() {
		let browser = this.detectBrowser()
		let base = `It looks like you're running ${browser}.`
		if (browser === 'Internet Explorer') {
			return `${base} There is no extension available for your browser.`
		}
		if (browser === 'Opera' || browser === 'Safari') {
			return `${base} The extension is under development. Let me know if you would use it.`
		}
		return `${base} Use the appropriate link below to install the extension.`
	}

	buttons() {
		return [
			{
				name: 'Google Chrome',
				button: (
					<BrowserButton
						key="chrome"
						onClick={this.installChromeExtension}
						browserName="Chrome"
					/>
				),
			},
			{
				name: 'Mozilla Firefox',
				button: (
					<BrowserButton
						key="firefox"
						onClick={this.installFirefoxExtension}
						browserName="Firefox"
					/>
				),
			},
			{
				name: 'Microsoft Edge',
				button: (
					<BrowserButton
						key="edge"
						disabled
						onClick={this.installEdgeExtension}
						browserName="Edge"
					/>
				),
			},
			{
				name: 'Safari',
				button: (
					<BrowserButton
						key="safari"
						disabled
						onClick={this.installSafariExtension}
						browserName="Safari"
					/>
				),
			},
			{
				name: 'Opera',
				button: (
					<BrowserButton
						key="opera"
						disabled
						onClick={this.installOperaExtension}
						browserName="Opera"
					/>
				),
			},
		]
	}

	primaryButton() {
		return this.buttons()
			.filter(btn => btn.name === this.detectBrowser())
			.map(btn => btn.button)[0]
	}

	secondaryButtons() {
		return this.buttons()
			.filter(btn => btn.name !== this.detectBrowser())
			.map(btn => btn.button)
	}

	render() {
		if (this.checkExtensionStatus()) {
			return (
				<div>
					<p>The extension is installed and active. Let's rock!</p>
				</div>
			)
		}

		return (
			<div>
				<p>
					Gobbldygook uses a browser extension to import your data
					from the SIS. Once you have imported your information, you
					don't need the extension anymore.
				</p>

				<p>{this.flavorText()}</p>

				<p>Install for {this.primaryButton()}. </p>

				<details>
					<summary>Not {this.detectBrowser()}?</summary>
					<p>
						We also have {interpose(this.secondaryButtons(), ', ')}.
					</p>
				</details>

				<p>
					{this.state.installError
						? this.state.installError.message
						: null}
				</p>
			</div>
		)
	}
}
