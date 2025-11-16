import "typeface-fira-sans"
import "./styles/normalize.scss"
import "./styles/css-colors.scss"
import "./styles/css-variables.scss"

// Include React and react-dom.render
import React from "react"
import { render } from "react-dom"

// Include google analytics (in production)
import startAnalytics from "./analytics"
startAnalytics()

// Kick off data loading
import loadData from "./workers/load-data"
loadData().catch((err) => console.error(err))

// ... attach the db for debugging
import { db } from "./helpers/db"
globalThis._db = db

// Kick off the GUI
console.log("3. 2.. 1... Blast off! 🚀")

import App from "./app"

// Create the redux store
import configureStore from "./redux"
import { Provider } from "react-redux"
import type { Store } from "redux"
import Notifications from "./modules/notifications"
const store = configureStore()

// for debugging
globalThis._dispatch = store.dispatch
globalThis._store = store

let renderFunc = (chosenStore: Store) => {
  let renderEl = document.getElementById("gobbldygook")
  if (!renderEl) {
    return
  }

  render(
    <Provider store={chosenStore}>
      <>
        <App />
        <Notifications />
      </>
    </Provider>,
    renderEl,
  )
}

renderFunc(store)
