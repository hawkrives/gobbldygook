import qs from 'query-string'
import { useQueries } from 'history'
import createHashHistory from 'history/lib/createHashHistory'

const history = useQueries(createHashHistory)({
	stringifyQuery: qs.stringify,
	parseQueryString: qs.parse,
})

export default history
