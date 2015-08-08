import flatten from 'lodash/array/flatten'
import glob from 'glob'
import junk from 'junk'
import uniq from 'lodash/array/uniq'

export default function findAreas(dir) {
	const sources = uniq(flatten(glob.sync(dir + '/**/*.yaml')))
	return sources.filter(junk.not)
}
