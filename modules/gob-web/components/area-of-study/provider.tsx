import * as React from "react"

import { db } from "../../helpers/db"
import type { HansonFile } from "@gob/hanson-format"

type Props = {
  children: (args: {
    loading: boolean
    areas: Array<HansonFile>
  }) => React.ReactNode
}

type State = {
  loading: boolean
  areas: Array<HansonFile>
}

export class AreaOfStudyProvider extends React.PureComponent<Props, State> {
  override state: State = {
    areas: [],
    loading: true,
  }

  override componentDidMount() {
    void this.cacheAreas()
  }

  cacheAreas = async () => {
    // the areas store holds the area files as they were downloaded
    let areas = await db.store("areas").getAll<HansonFile>()

    this.setState(() => ({ areas, loading: false }))
  }

  override render() {
    let { areas, loading } = this.state
    return this.props.children({ areas, loading })
  }
}
