import yaml from 'js-yaml'

import getStdin from 'get-stdin'
import {enhanceHanson} from './enhance-hanson'

export default async function main() {
	let data = await getStdin()

	let deserialized = yaml.safeLoad(data)

	let enhanced = enhanceHanson(deserialized)

	console.log(JSON.stringify(enhanced, null, 2))
}
