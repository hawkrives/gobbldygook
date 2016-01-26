import history from '../../history'
import { syncHistory } from 'react-router-redux'

// exports a redux middleware for this history
export default syncHistory(history)
