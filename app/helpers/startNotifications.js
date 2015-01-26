import notificationActions from '../flux/notificationActions'
window.addEventListener('error', notificationActions.logError)
// notificationActions.startProgress(1, 'Testing Progress Bars', {max: 4, value: 1}, true)
// notificationActions.logMessage(0, 'Testing Messages')
// notificationActions.logError({message: 'Testing Errors'})

import React from 'react'
import Notifications from '../elements/notifications'
React.render(React.createElement(Notifications), document.querySelector('.notifications'))
