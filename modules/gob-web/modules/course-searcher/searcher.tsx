import * as React from "react"

import { toPrettyTerm, expandYear } from "@gob/school-st-olaf-college"
import { Card } from "../../components/card.ts"
import { LabelledSelect } from "./labelled-select.tsx"
import { FlatButton } from "../../components/button.ts"
import toPairs from "lodash/toPairs.js"
import Loading from "../../components/loading.tsx"
import { SORT_BY, GROUP_BY } from "./constants.ts"
import type { SORT_BY_KEY, GROUP_BY_KEY } from "./constants.ts"
import { CourseResultsList } from "./results-list.tsx"
import { Querent } from "./querent.tsx"

import "./searcher.scss"

type Props = {
  onCloseSearcher?: (() => unknown) | null | undefined
  term?: number | null | undefined
  studentId?: string | undefined
}

type State = {
  query: string
  groupBy: GROUP_BY_KEY
  sortBy: SORT_BY_KEY
  limitTo: string
  filterBy: string
  hasQueried: boolean
}

// the <select>s only offer keys of these maps
const isSortKey = (value: string): value is SORT_BY_KEY => value in SORT_BY
const isGroupKey = (value: string): value is GROUP_BY_KEY => value in GROUP_BY

export class CourseSearcher extends React.Component<Props, State> {
  override state: State = {
    groupBy: "term",
    sortBy: "title",
    limitTo: "",
    filterBy: "",
    query: "",
    hasQueried: false,
  }

  handleSortChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    let value = ev.currentTarget.value
    if (isSortKey(value)) {
      this.setState(() => ({ sortBy: value }))
    }
  }

  handleGroupByChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    let value = ev.currentTarget.value
    if (isGroupKey(value)) {
      this.setState(() => ({ groupBy: value, filterBy: "" }))
    }
  }

  handleFilterByChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    let value = ev.currentTarget.value
    this.setState(() => ({ filterBy: value }))
  }

  handleLimitToChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    let value = ev.currentTarget.value
    this.setState(() => ({ limitTo: value }))
  }

  updateQuery = (query: string) => {
    this.setState(() => ({ query }))
  }

  handleQueryChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.updateQuery(ev.currentTarget.value)
  }

  override render() {
    let { groupBy, query, sortBy, filterBy, limitTo } = this.state

    let { onCloseSearcher, studentId, term } = this.props

    // This tells React to unmount and recreate the search hierarchy, so that it all updates as we type
    let termKey = String(term)
    let key = `${query}-${termKey}-${groupBy}-${sortBy}-${filterBy}-${limitTo}`

    return (
      <>
        <Card as="header" className="sidebar-heading">
          <h2>
            Course Search
            {term != null && term !== 0 && !Number.isNaN(term) ? (
              <>
                <br />({toPrettyTerm(term)})
              </>
            ) : (
              term
            )}
          </h2>
          {onCloseSearcher && (
            <FlatButton
              className="close-sidebar"
              title="Close Search"
              onClick={onCloseSearcher}
            >
              Close
            </FlatButton>
          )}

          <input
            type="search"
            className="search-box"
            value={query}
            placeholder="Search for a course or phrase"
            onChange={this.handleQueryChange}
            // autoFocus={true}
          />
        </Card>

        <Querent
          key={key}
          query={query}
          groupBy={groupBy}
          sortBy={sortBy}
          term={term}
          filterBy={filterBy}
          limitTo={limitTo}
        >
          {({ error, inProgress, results, didSearch, keys, years }) => {
            if (error != null && error !== "") {
              return (
                <Card className="course-results--notice">
                  Something broke :-(
                </Card>
              )
            }

            let potentialFilters = keys.map((k): [string, string] => [k, k])
            potentialFilters.unshift(["", "No Filter"])

            let potentialYearLimits = years
              .map((k): [string, string] => [String(k), expandYear(k)])
              .toArray()
            potentialYearLimits.unshift(["", "All Years"])

            if (limitTo && !years.has(parseInt(limitTo, 10))) {
              potentialYearLimits.push([limitTo, expandYear(limitTo)])
            }

            let filters = (
              <Card className="search-filters">
                <LabelledSelect
                  label="Limit to:"
                  options={potentialYearLimits}
                  onChange={this.handleLimitToChange}
                  value={limitTo}
                />

                <LabelledSelect
                  label="Sort by:"
                  options={toPairs(SORT_BY)}
                  onChange={this.handleSortChange}
                  value={sortBy}
                />

                <LabelledSelect
                  label="Group by:"
                  options={toPairs(GROUP_BY)}
                  onChange={this.handleGroupByChange}
                  value={groupBy}
                />

                <LabelledSelect
                  label="Filter by:"
                  options={potentialFilters}
                  onChange={this.handleFilterByChange}
                  value={filterBy}
                />
              </Card>
            )

            if (inProgress) {
              return (
                <>
                  {filters}
                  <Card className="course-results--notice">
                    <Loading>Searching…</Loading>
                  </Card>
                </>
              )
            }

            if (results.size === 0) {
              if (!didSearch) {
                return (
                  <Card className="course-results--notice">
                    Search for something!
                  </Card>
                )
              }
              return (
                <>
                  {filters}
                  <Card className="course-results--notice">
                    No Results Found
                  </Card>
                </>
              )
            }

            return (
              <>
                {filters}

                <CourseResultsList
                  groupedBy={groupBy}
                  studentId={studentId}
                  results={results}
                />
              </>
            )
          }}
        </Querent>
      </>
    )
  }
}
