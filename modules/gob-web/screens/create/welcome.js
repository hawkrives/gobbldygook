// @flow

import * as React from 'react'
import {Link} from '@reach/router'
import {RaisedButton} from '../../components/button'
import {Choices, Header} from './components'

export default function WelcomeScreen() {
	return (
		<>
			<Header>
				<h1>Hi there!</h1>
				<h2>I don't know anything about you. Care to enlighten me?</h2>
			</Header>
			<section>
				<p>We need to know:</p>
				<ul>
					<li>what year you entered the college,</li>
					<li>when you plan on graduating from the college,</li>
					<li>what you want to major in,</li>
					<li>and anything you've already taken.</li>
				</ul>
				<p>
					We have a few ways to do that: you can import your data from
					the SIS, you can link up to a previous file on Google Drive,
					you can upload an exported file, or you can just fill
					everything out manually.
				</p>
			</section>
			<Choices>
				<RaisedButton as={Link} to="sis">
					Import from the SIS
				</RaisedButton>
				<RaisedButton as={Link} to="upload">
					Upload a File
				</RaisedButton>
				<RaisedButton as={Link} to="manual">
					Create Manually
				</RaisedButton>
			</Choices>
		</>
	)
}
