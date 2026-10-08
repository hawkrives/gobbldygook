import * as React from "react"
import type { Course as CourseType } from "@gob/types"
import { queryCourseDatabase } from "../../helpers/query-course-database"
import mem from "mem"
import { sortAndGroup } from "./lib"
import { ga } from "../../analytics"
import { List } from "immutable"
import type { Set } from "immutable"
import type { GROUP_BY_KEY, SORT_BY_KEY } from "./constants"

type Props = {
  query: string
  term?: number | null | undefined
  children: (args: {
    error: string | null
    inProgress: boolean
    didSearch: boolean
    results: List<string | CourseType>
    keys: Array<string>
    years: Set<number>
  }) => React.ReactNode
  groupBy: GROUP_BY_KEY
  sortBy: SORT_BY_KEY
  limitTo: string
  filterBy: string
}

type State = {
  error: string | null
  inProgress: boolean
  didSearch: boolean
  results: List<CourseType>
}

const memSortAndGroup: typeof sortAndGroup = mem(sortAndGroup, {
  maxAge: 10000,
})

// The searcher gives each query its own Querent (through `key`), so a
// Querent only ever runs the query it mounted with
export class Querent extends React.Component<Props, State> {
  override state: State = {
    error: "",
    inProgress: false,
    results: List(),
    didSearch: false,
  }

  _isMounted: boolean = false

  override componentDidMount() {
    this._isMounted = true

    let props = this.props
    if (props.query || props.term) {
      this.submitQuery(props.query, { term: props.term })
    }
  }

  override componentWillUnmount() {
    this._isMounted = false
  }

  submitQuery = async (
    query: string,
    { term }: { term?: number | null | undefined },
  ) => {
    if (!query && term == null) {
      return
    }

    if (term == null && query.length < 3) {
      this.setState(() => ({ didSearch: false }))
      return
    }

    ga("send", "event", "search_query", "submit", query, 1)

    console.time(`query: ${query}`)

    this.setState(() => ({ inProgress: true }))

    try {
      const payload = await queryCourseDatabase(
        query,
        term == null ? {} : { term },
      )
      console.timeEnd(`query: ${query}`)

      if (!this._isMounted) {
        return
      }

      this.setState(() => ({
        didSearch: true,
        inProgress: false,
        results: List(payload),
      }))
    } catch (error) {
      if (!this._isMounted) {
        return
      }
      this.setState(() => ({
        didSearch: true,
        inProgress: false,
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  override render() {
    let { error, inProgress, results, didSearch } = this.state

    let {
      sortBy: sorting,
      groupBy: grouping,
      filterBy: filtering,
      limitTo: limiting,
    } = this.props

    let {
      results: grouped,
      years,
      keys,
    } = memSortAndGroup(results, {
      sorting,
      grouping,
      filtering,
      limiting,
    })

    return this.props.children({
      error,
      inProgress,
      didSearch,
      results: grouped,
      years,
      keys,
    })
  }
}
