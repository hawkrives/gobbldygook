const babel = require('babel-core')
const resolve = require('resolve-from')
const fspath = require('path')
const pkgup = require('pkg-up')
const pkgpath = fspath.dirname(pkgup.sync())
const _ = require('lodash')
// const Graph = require('graph').Graph

function findDeps(fullFilePath) {
	const tfmd = babel.transformFileSync(fullFilePath, {
		sourceType: 'module',
		extends: '/Users/hawken/gobbldygook/.babelrc',
	})
	let dirname = fspath.dirname(fullFilePath)

	let references = []
	babel.traverse(tfmd.ast, {
		enter(path) {
			if (
				path.node.type === 'CallExpression' &&
				path.node.callee.name === 'require'
			) {
				let refs = path.node.arguments
					.map(a => a.value)
					.map(id => resolve(dirname, id))
				references = references.concat(refs)
			}
		},
	})

	return references
}

function shortenPath(path) {
	return fspath.relative(pkgpath, path)
}

function prettyifyResults(res) {
	let pairs = _.toPairs(res)
	let edited = _.map(pairs, ([key, val]) => {
		key = shortenPath(key)
		val = val.map(shortenPath)
		return [key, val]
	})
	return _.fromPairs(_.sortBy(edited, ([k]) => k))
}

function main() {
	let seen = {}

	let toTraverse = process.argv.slice(2)
	let p

	while ((p = toTraverse.pop())) {
		let fullPath = fspath.resolve(p)
		// console.log(fullPath)

		if (seen.hasOwnProperty(fullPath)) {
			continue
		}

		seen[fullPath] = findDeps(fullPath)
		seen[fullPath] = _.reject(seen[fullPath], p => _.includes(p, 'node_modules'))
		toTraverse = toTraverse.concat(seen[fullPath])
	}

	// console.log(seen)
	let nice = prettyifyResults(seen)
	console.log(nice)
	// console.log(new Graph(nice))
}

main()
