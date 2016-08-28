const scopes = [
	'profile',
	'email',
	'https://www.googleapis.com/auth/drive.appfolder',
]
const scope = scopes.join(' ')

export function gplatform() {
	let js = document.createElement('script')
	js.id = 'google-login'
	js.src = '//apis.google.com/js/platform.js'
	js.onload = () => {
		window.gapi.load('auth2', () => {
			if (window.gapi.auth2.getAuthInstance()) {
				return
			}

			window.gapi.auth2.init({
				client_id: GOOGLE_APP_ID, // eslint-disable-line camelcase
				scope: scope,
			})
		})
	}

	document.body.appendChild(js)
}

export function auth() {
	if (!window.gapi) {
		throw new Error('The Google sign-in function is not loaded. Please try again.')
	}

	return window.gapi.auth2.getAuthInstance()
}

export default function start() {
	console.log('Initializing Google API 📋')
	gplatform()
}
