import notificationActions from '../flux/notificationActions'
window.addEventListener('error', notificationActions.logError)

import React from 'react'
import Notifications from '../elements/notifications'
React.render(React.createElement(Notifications), document.querySelector('.notifications'))
