// @flow

import Loadable from 'react-loadable'
import {Loading} from './components/loading'

export const Editor = Loadable({
	loader: () => import('./screens/m-editor').then(m => m.Editor),
	loading: Loading,
})
