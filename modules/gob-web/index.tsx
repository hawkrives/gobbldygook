// Fira Sans, latin subset, every weight in upright and italic
import "@fontsource/fira-sans/latin-100.css"
import "@fontsource/fira-sans/latin-100-italic.css"
import "@fontsource/fira-sans/latin-200.css"
import "@fontsource/fira-sans/latin-200-italic.css"
import "@fontsource/fira-sans/latin-300.css"
import "@fontsource/fira-sans/latin-300-italic.css"
import "@fontsource/fira-sans/latin-400.css"
import "@fontsource/fira-sans/latin-400-italic.css"
import "@fontsource/fira-sans/latin-500.css"
import "@fontsource/fira-sans/latin-500-italic.css"
import "@fontsource/fira-sans/latin-600.css"
import "@fontsource/fira-sans/latin-600-italic.css"
import "@fontsource/fira-sans/latin-700.css"
import "@fontsource/fira-sans/latin-700-italic.css"
import "@fontsource/fira-sans/latin-800.css"
import "@fontsource/fira-sans/latin-800-italic.css"
import "@fontsource/fira-sans/latin-900.css"
import "@fontsource/fira-sans/latin-900-italic.css"
import "./styles/normalize.scss"
import "./styles/css-colors.scss"
import "./styles/css-variables.scss"

// Include react-dom.render
import { render } from "react-dom"
import type { Store } from "redux"

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
import Notifications from "./modules/notifications"
const store = configureStore()

// for debugging
globalThis._dispatch = store.dispatch
globalThis._store = store

declare global {
  // the database and store, attached for debugging in the console
  var _db: typeof db | undefined
  var _store: Store | undefined
}

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
