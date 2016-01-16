import history from '../../history'
import { syncHistory } from 'redux-simple-router'

// exports a redux middleware for this history
export default syncHistory(history)
