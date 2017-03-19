// @flow

import debug from 'debug'
const log = debug('worker:load-data:dispatch')

function dispatch(type: string, action: string, ...args: any[]) {
    const toDispatch = [null, 'dispatch', { type, action, args }]

    log(toDispatch)
    self.postMessage(toDispatch)
}

export const refreshCourses = () => dispatch('courses', 'refreshCourses')
export const refreshAreas = () => dispatch('areas', 'refreshAreas')
export const quotaExceededError = (dbName: string) => {
    dispatch('notifications', 'logError', {
        id: 'db-storage-quota-exceeded',
        message: `The database "${dbName}" has exceeded its storage quota.`,
    })
}

export class Notification {
    id: string;
    type: string;
    length = 1;
    store = 'notifications';

    constructor(notificationType: string) {
        this.id = notificationType
        this.type = notificationType
    }

    start(length: number) {
        this.length = length

        const msg = `Loading ${this.type}`
        const args = { max: this.length, showButton: true }
        dispatch(this.store, 'startProgress', this.id, msg, args)
    }

    increment() {
        dispatch(this.store, 'incrementProgress', this.id)
    }

    remove() {
        dispatch(this.store, 'removeNotification', this.id, 1500)
    }
}
