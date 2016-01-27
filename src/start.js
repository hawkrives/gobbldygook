import isSafari from 'is-safari'

const canonicalUrl = 'https://www.stolaf.edu/people/rives/g'
function redirectIfNeeded() {
	if (typeof window !== 'undefined') {
		let {protocol, hostname} = window.location
		if (hostname === 'localhost') {
			return
		}
		if (hostname !== 'www.stolaf.edu') {
			window.location = canonicalUrl
		}
		if (protocol !== 'https:') {
			window.location = canonicalUrl
		}
	}
}

if (isSafari) {
	document.write(`
        Safari is not supported, unfortunately, until Apple gets
		<a href="https://bugs.webkit.org/show_bug.cgi?id=136888">their</a>
		<a href="https://bugs.webkit.org/show_bug.cgi?id=136937">indexedDB</a>
		support together. Please use another web browser, such as
		<a href="https://google.com/chrome">Chrome</a>,
		<a href="https://firefox.com">Firefox</a>,
		<a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a>,
		<a href="http://opera.com">Opera</a>,
		<a href="https://vivaldi.com">Vivaldi</a>, or even
		<a href="http://windows.microsoft.com/en-us/internet-explorer/">Internet Explorer</a>,
	`)
}

else {
	redirectIfNeeded()

	require('./index.js')
}
