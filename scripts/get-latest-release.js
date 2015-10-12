import latest from 'latest-release'

export function cli() {
	latest('hawkrives', 'gobbldygook', (release, err) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}

		if (!release) {
			console.warn('No releases found')
			process.exit(0)
		}

		console.log(release.name)
	})
}
