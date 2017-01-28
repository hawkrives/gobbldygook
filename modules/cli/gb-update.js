import { checkForStaleData } from './lib/update-local-data-cache'

export default function update() {
	// grab info.json
	// apply loadData's algorithm to it
  return checkForStaleData()
}
