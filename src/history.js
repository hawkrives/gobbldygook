import createHistory from 'history/lib/createBrowserHistory'
import useRouterHistory from 'react-router/lib/useRouterHistory'
import useBasename from 'history/lib/useBasename'
import useQueries from 'history/lib/useQueries'

const history = useRouterHistory(useBasename(useQueries(createHistory)))({basename: APP_BASE})

export default history
