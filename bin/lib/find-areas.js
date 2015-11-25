import flatten from 'lodash/array/flatten'
import glob from 'glob'
import junk from 'junk'
import uniq from 'lodash/array/uniq'
import path from 'path'

export default function findAreas(dir, filetype='yaml') {
	const sources = uniq(flatten(glob.sync(path.join(dir, `**/*.${filetype}`))))
	return sources.filter(junk.not)
}
