declare global {
  interface Window {
    GoogleAnalyticsObject?: string
    // analytics.js replaces the queue object with its tracker function
    ga?:
      | ((...args: Array<unknown>) => void)
      | { q: Array<Array<unknown>>; l: number }
  }
}

export function isogram() {
  // todo: add function for tracking events
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events

  window.GoogleAnalyticsObject = "ga"
  window.ga = {
    q: [
      ["create", "UA-10662325-7", "auto"],
      ["send", "pageview"],
    ],
    l: Number(new Date()),
  }

  let script = document.createElement("script")
  script.async = true
  script.src = "//www.google-analytics.com/analytics.js"
  document.body.appendChild(script)
}

export function ga(...args: Array<unknown>) {
  if (process.env.NODE_ENV === "production") {
    try {
      // throws, and is ignored, until analytics.js has loaded
      ;(window.ga as (...args: Array<unknown>) => void)(...args)
    } catch (_e) {} // eslint-disable-line no-empty
  }
}

export default function start() {
  if (process.env.NODE_ENV === "production") {
    console.log("Initializing analytics 📊")
    isogram()
  }
}
