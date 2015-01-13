import errorActions from '../flux/errorActions'
window.addEventListener('error', errorActions.logError)

import React from 'react'
import Notifications from '../elements/notifications'
React.render(React.createElement(Notifications), document.querySelector('.notifications'))
