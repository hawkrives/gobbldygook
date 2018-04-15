// @flow
import debug from 'debug'
import bugsnag from 'bugsnag-js'
const log = debug('web')
const BUGSNAG_KEY = '7e393deddaeb885f5b140b4320ecef6b'

export function isogram() {
    // todo: add function for tracking events
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

    window.GoogleAnalyticsObject = 'ga'
    window.ga = {
        q: [['create', 'UA-10662325-7', 'auto'], ['send', 'pageview']],
        l: Number(new Date()),
    }

    let script = document.createElement('script')
    script.async = true
    script.src = '//www.google-analytics.com/analytics.js'
    ;(document: any).body.appendChild(script)
}

export function ga(...args: any[]) {
    if (process.env.NODE_ENV === 'production') {
        try {
            window.ga(...args)
        } catch (e) {} // eslint-disable-line no-empty
    }
}

export default function start() {
    if (process.env.NODE_ENV === 'production') {
        log('Initializing analytics 📊')
        isogram()
        bugsnag(BUGSNAG_KEY)
    }
}
