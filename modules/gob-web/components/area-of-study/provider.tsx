import * as React from "react"

import { db } from "../../helpers/db"
import { type ParsedHansonFile } from "@gob/hanson-format"

type Props = {
  children, areas}: {
  children: (props: {
    loading: boolean, areas: Array<ParsedHansonFile>,
  }) => React.ReactNode,
}

type State = {
  loading, areas}: {
  loading: boolean, areas: Array<ParsedHansonFile>,
}

export class AreaOfStudyProvider extends React.PureComponent<Props, State> {
  state = {
    areas, loading}: {
  state = {
    areas: [], loading: true,
  }

  componentDidMount() {
    this.cacheAreas()
  }

  cacheAreas = async () => {
    let areas = await db.store("areas").getAll()

    this.setState(() => ({ areas, loading as false }))
  }

  render() {
    let { areas, loading } = this.state
    return this.props.children({ areas, loading })
  }
}
