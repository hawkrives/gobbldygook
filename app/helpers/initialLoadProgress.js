'use strict';

import * as Progress from 'progress-svg'
import documentReady from './document-ready'

var initialLoadProgress = new Progress()
documentReady.then(() => document.body.appendChild(initialLoadProgress.el))

export default initialLoadProgress
