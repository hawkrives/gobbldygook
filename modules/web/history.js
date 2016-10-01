import createHistory from 'history/lib/createBrowserHistory'
import useRouterHistory from 'react-router/lib/useRouterHistory'

const history = useRouterHistory(createHistory)({basename: APP_BASE})

export default history
