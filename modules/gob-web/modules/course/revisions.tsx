import * as React from "react"
import toPairs from "lodash/toPairs.js"
import upperFirst from "lodash/upperFirst.js"
import styled from "styled-components"

import { consolidateExpandedOfferings } from "./offerings.ts"
import { Icon } from "../../components/icon.ts"
import { chevronUp, chevronDown } from "../../icons/ionicons.tsx"

import type { Course as CourseType, Offering } from "@gob/types"

type Props = {
  course: CourseType
}

// a course's fields, as a revision can set them to anything
type CourseState = Record<string, unknown>

const RevisionsTable = styled.table`
  border-collapse: collapse;
  font-size: 0.85em;
  width: 100%;
  margin-top: 0.5em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
`

const TableHead = styled.thead`
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
`

const TableBody = styled.tbody`
  & tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  & tr:hover {
    background-color: #f0f0f0;
  }

  & tr[data-date="true"]:not(:first-child) {
    border-top: 1px solid #eee;
  }
`

const Head = styled.th`
  padding: 5px 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-weight: 600;
  white-space: nowrap;

  &:first-child {
    padding-left: 12px;
  }
`

const Row = styled.tr``

const Data = styled.td`
  padding: 3px 8px;
  vertical-align: middle;
  font-family: var(--monospace-font);
  font-size: 0.9em;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-child {
    white-space: nowrap;
    padding-left: 12px;
  }
`

const KeyData = styled(Data)`
  color: #555;
  white-space: nowrap;
`

const DateData = styled(Data)`
  font-family: inherit;
  white-space: nowrap;
  color: #666;
`

const RevisionContainer = styled.details`
  margin-top: 1em;
  border-top: 1px solid #eee;
  padding-top: 0.5em;

  & > summary {
    font-weight: 500;
    color: #666;
    cursor: pointer;
    margin-bottom: 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      color: #000;
    }
  }

  &[open] > summary {
    margin-bottom: 0.8em;
  }
`

const SummaryText = styled.span`
  flex: 1;
`

const ChevronWrapper = styled.span`
  margin-left: 0.5em;
`

type State = { isOpen: boolean }

export class Revisions extends React.Component<Props, State> {
  override state: State = {
    isOpen: false,
  }

  handleToggle = (_e: React.SyntheticEvent<HTMLDetailsElement>) => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }))
  }

  override render() {
    const { course } = this.props
    const { isOpen } = this.state

    // course data comes from JSON, and some courses leave out revisions
    const courseRevisions = course.revisions as
      | CourseType["revisions"]
      | undefined
    if (!courseRevisions) {
      return null
    }

    const capitalize = (str: string) => {
      if (!str) return str
      return upperFirst(str)
    }

    const isOffering = (v: unknown): v is Offering =>
      typeof v === "object" &&
      v !== null &&
      "day" in v &&
      typeof v.day === "string" &&
      "start" in v &&
      typeof v.start === "string" &&
      "end" in v &&
      typeof v.end === "string"

    const formatValue = (value: unknown, key: string = "") => {
      if (value === undefined || value === null) {
        return "—"
      }
      if (key === "offerings" && Array.isArray(value)) {
        const arr: Array<unknown> = value
        const offerings = arr.filter(isOffering)
        if (offerings.length > 0) {
          const consolidated = consolidateExpandedOfferings(offerings)
          return consolidated.join(", ")
        }
        return `[${arr.length} offerings]`
      }
      if (Array.isArray(value)) {
        return value.join(", ")
      }
      if (typeof value === "object") {
        return toPairs(value)
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join(", ")
      }
      // oxlint-disable-next-line typescript/no-base-to-string -- objects are handled above, so only primitives reach here
      return String(value)
    }

    const formatDate = (dateString: string | Date) => {
      const date = new Date(dateString)
      const month = date
        .toLocaleString("en-US", { month: "short" })
        .padEnd(4, " ")
      const day = date.getDate().toString().padStart(2, "0")
      const year = date.getFullYear()
      return `${month}${day}, ${year}`
    }

    const { revisions: _revisions, ...currentState }: CourseState = course

    const revisions = [...courseRevisions]
    const latestRevisionDate =
      revisions.length > 0
        ? new Date(
            Math.max(
              ...revisions.map((rev) => new Date(rev["_updated"]).getTime()),
            ),
          )
        : null
    const dateForCurrentState = latestRevisionDate ?? new Date()

    type DatedState = { date: string; state: CourseState }

    const courseStates = revisions.reduce<Array<DatedState>>(
      (states, revision) => {
        const revisionDate = formatDate(revision["_updated"])
        // the reduce starts with the current state, so there is always one
        const prevState = { ...states[states.length - 1]!.state }

        toPairs(revision).forEach(([key, value]) => {
          if (key !== "_updated") {
            prevState[key] = value
          }
        })

        return [
          ...states,
          {
            date: revisionDate,
            state: prevState,
          },
        ]
      },
      [
        {
          date: formatDate(dateForCurrentState),
          state: currentState,
        },
      ],
    )

    const allChanges: Array<{
      date: string
      key: string
      newer: unknown
      older: unknown
    }> = []

    for (let i = 0; i < courseStates.length - 1; i++) {
      // i and i + 1 are both in bounds
      const newerState = courseStates[i]!
      const olderState = courseStates[i + 1]!
      const newer = newerState.state
      const older = olderState.state
      const changeDate = newerState.date

      const allKeys = new Set([...Object.keys(newer), ...Object.keys(older)])

      allKeys.forEach((key) => {
        if (key !== "_updated" && key !== "revisions") {
          const newerVal = newer[key]
          const olderVal = older[key]

          const isDifferent =
            Array.isArray(newerVal) && Array.isArray(olderVal)
              ? JSON.stringify(newerVal) !== JSON.stringify(olderVal)
              : newerVal !== olderVal

          if (isDifferent) {
            allChanges.push({
              date: changeDate,
              key: capitalize(key),
              newer: newerVal,
              older: olderVal,
            })
          }
        }
      })
    }

    allChanges.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      if (dateA > dateB) return -1
      if (dateA < dateB) return 1

      return a.key.localeCompare(b.key)
    })

    if (allChanges.length === 0) {
      return null
    }

    let lastDate = ""

    return (
      <RevisionContainer onToggle={this.handleToggle}>
        <summary>
          <SummaryText>Revision History</SummaryText>
          <ChevronWrapper>
            <Icon>{isOpen ? chevronUp : chevronDown}</Icon>
          </ChevronWrapper>
        </summary>
        <RevisionsTable>
          <TableHead>
            <Row>
              <Head>Date</Head>
              <Head>Field</Head>
              <Head>Previous</Head>
              <Head>Current</Head>
            </Row>
          </TableHead>
          <TableBody>
            {allChanges.map((change, index) => {
              const isNewDate = change.date !== lastDate
              lastDate = change.date

              return (
                <Row key={index} data-date={isNewDate ? "true" : "false"}>
                  <DateData>{change.date}</DateData>
                  <KeyData>{change.key}</KeyData>
                  <Data>
                    {formatValue(change.older, change.key.toLowerCase())}
                  </Data>
                  <Data>
                    {formatValue(change.newer, change.key.toLowerCase())}
                  </Data>
                </Row>
              )
            })}
          </TableBody>
        </RevisionsTable>
      </RevisionContainer>
    )
  }
}
