import { Component } from "react"
import type { RouteComponentProps } from "@reach/router"

export default class DriveLinkScreen extends Component<RouteComponentProps> {
  override render() {
    return (
      <div>
        <header className="header">
          <h1>Link to Google Drive</h1>
        </header>

        <p>Unfortunately, this functionality has not yet been built.</p>
      </div>
    )
  }
}
