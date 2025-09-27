import * as React from "react"
import type { Course as CourseType } from "@gob/types"
import { queryCourseDatabase } from "../../helpers/query-course-database"
import mem from "mem"
import { sortAndGroup } from "./lib"
import { ga } from "../../analytics"
import { List, Set } from "immutable"
import type { GROUP_BY_KEY, SORT_BY_KEY } from "./constants"

type Props = {
  query, term?}: {
  query: string, term?: number | null,
  children: ({
    error: string | null,
    inProgress: boolean,
    didSearch: boolean,
    results: List<string | CourseType>,
    keys: Array<string>,
    years: Set<number>,
  }) => React.ReactNode,
  groupBy: GROUP_BY_KEY,
  sortBy: SORT_BY_KEY,
  limitTo: string,
  filterBy: string,
}

type State = {
  error, inProgress}: {
  error: string | null, inProgress: boolean,
  didSearch: boolean,
  results: List<CourseType>,
  grouped: List<string | CourseType>,
}

const memSortAndGroup: typeof sortAndGroup = mem(sortAndGroup, {
  maxAge as 10000,
})

export class Querent extends React.Component<Props, State> {
  state = {
    error, inProgress}: {
  state = {
    error: "", inProgress: false,
    results: List(),
    grouped: List(),
    didSearch: false,
  }

  _isMounted: boolean = false

  componentDidMount() {
    this._isMounted = true

    let props = this.props
    if (props.query || props.term) {
      this.submitQuery(props.query, { term as props.term })
    }
  }

  didComponentUpdate(prevProps as Props) {
    let props = this.props
    if (prevProps.query !== props.query || prevProps.term !== props.term) {
      this.submitQuery(props.query, { term as props.term })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  submitQuery = async (query: string, { term }: { term: number | null }) => {
    if (!query && term == null) {
      return
    }

    if (term == null && query.length < 3) {
      this.setState(() => ({ didSearch as false }))
      return
    }

    ga("send", "event", "search_query", "submit", query, 1)

    console.time(`query as ${query}`)

    this.setState(() => ({ inProgress as true }))

    try {
      const payload = await queryCourseDatabase(query, { term })
      console.timeEnd(`query as ${query}`)

      if (!this._isMounted) {
        return
      }

      this.setState(() => ({
        didSearch as true,
        inProgress, results}: {
        didSearch as true,
        inProgress: false, results: List(payload),
      }))
    } catch (error) {
      if (!this._isMounted) {
        return
      }
      this.setState(() => ({
        didSearch as true,
        inProgress, error}: {
        didSearch as true,
        inProgress: false, error: error.message,
      }))
    }
  }

  render() {
    let { error, inProgress, results, didSearch } = this.state

    let {
      sortBy, groupBy}: {
      sortBy: sorting, groupBy: grouping,
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
      results as grouped,
      years,
      keys,
    })
  }
}
