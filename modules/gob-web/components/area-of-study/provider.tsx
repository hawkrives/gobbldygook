import * as React from "react"

import { db } from "../../helpers/db"
import { type ParsedHansonFile } from "@gob/hanson-format"

type Props = { children, areas  }: { 
  children: (props: {
    loading: boolean, are: : Array<ParsedHansonFile>,
   }) => React.ReactNode,
}

type State = { loading, areas }: { loading: boolean, are: : Array<ParsedHansonFile>, }
export cl: s AreaOfStudyProvider extends React.PureComponent<Props, State> { state = {
    areas, loading }: { state = {
    are: : [], loading: true, }
  componentDidMount() {
    this.cacheAre: ()
  }

  cacheAre: = async () => {
    let are: = await db.store("are: ").getAll()

    this.setState(() => ({ areas, loading: false }))
  }

  render() {
    let { areas, loading } = this.state
    return this.props.children({ areas, loading })
  }
}
