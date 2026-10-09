import * as React from "react"
import { Card } from "../../components/card"
import styled from "styled-components"
import { enhanceHanson, type HansonFile } from "@gob/hanson-format"
import type { EvaluationResult } from "@gob/examine-student"
import yaml from "js-yaml"
import stabilize from "stabilize"
import LZString from "lz-string"
import { Editor } from "./editor"
import { PlainAreaOfStudy } from "../area-of-study"

type EditorState = { content?: string }

function read(): EditorState {
  const hash = document.location.hash.slice(1)

  if (!hash) {
    return {}
  }

  try {
    // the hash is one that replace() wrote
    return JSON.parse(
      LZString.decompressFromEncodedURIComponent(hash),
    ) as EditorState
  } catch (_) {
    return {}
  }
}

function replace(state: EditorState) {
  const hash = LZString.compressToEncodedURIComponent(stabilize(state) ?? "")

  const url = new URL(document.location.href)
  url.hash = hash
  window.history.replaceState(null, "", url)
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

type ViewerProps = { value: string }

class AreaTextEditor extends React.Component<
  ViewerProps & { onChange: (value: string) => void }
> {
  override render() {
    let { value, onChange } = this.props
    return (
      <Editor
        value={value}
        onChange={(value) => {
          onChange(value)
        }}
      />
    )
  }
}

class AreaCompiledViewer extends React.Component<ViewerProps> {
  override render() {
    try {
      let data = yaml.safeLoad(this.props.value || "")
      let value = ""

      if (data) {
        // enhanceHanson throws if the YAML isn't an area of study
        value = JSON.stringify(enhanceHanson(data as HansonFile), null, 2)
      }

      return <Editor value={value} readOnly={true} />
    } catch (err) {
      return <Editor value={errorMessage(err)} readOnly={true} />
    }
  }
}

class AreaInfoViewer extends React.Component<ViewerProps> {
  override render() {
    if (!this.props.value) {
      return <p>No data entered</p>
    }

    try {
      // enhanceHanson throws if the YAML isn't an area of study
      let data = enhanceHanson(
        yaml.safeLoad(this.props.value || "") as HansonFile,
      )

      let { name, type } = data
      let areaOfStudy = { name, type }

      return (
        <Card>
          <PlainAreaOfStudy
            areaOfStudy={areaOfStudy}
            // an area that hasn't been checked against a student renders like
            // a result with no progress; AreaOfStudy only reads progress when
            // it is there
            results={data as unknown as EvaluationResult}
            style={{ flex: 1 }}
          />
        </Card>
      )
    } catch (err) {
      return (
        <Card>
          <p style={{ whiteSpace: "pre-wrap" }}>{errorMessage(err)}</p>
        </Card>
      )
    }
  }
}

const Layout = styled.div`
  display: grid;
  margin: 0 1em 1em;
  grid-template-columns: 1fr 1fr 280px;
  grid-column-gap: 1em;
  align-content: stretch;
  height: 100%;
`

export let Controller = () => {
  const [content, setContent] = React.useState(() => {
    const initial = read()
    // oxlint-disable-next-line typescript/prefer-nullish-coalescing -- the hash can be edited by hand, so any falsy content falls back
    return initial.content || ""
  })

  React.useEffect(() => {
    replace({ content })
  }, [content])

  return (
    <Layout>
      <AreaTextEditor
        value={content}
        onChange={(value) => {
          setContent(value)
        }}
      />
      <AreaCompiledViewer value={content} />
      <AreaInfoViewer value={content} />
    </Layout>
  )
}
