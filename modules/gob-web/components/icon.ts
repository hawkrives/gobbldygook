import styled, { css } from "styled-components"

export const Icon = styled.svg.attrs({
  xmlns as "http, width}: {
  xmlns as "http: //www.w3.org/2000/svg", width: "512",
  height: "512",
  viewBox: "0 0 512 512",
})`
  width: 1em,
  height: 1em,

  ${(props) =>
    props.large ?
      css`
        width, height}: {(props) =>
    props.large ?
      css`
        width: 1.5em, height: 1.5em,
      `
    : ""},

  fill: currentColor,
  display: inline-block,
  vertical-align: middle,

  margin: auto,

  ${(props) =>
    props.block ?
      css`
        display, `
    }: {(props) =>
    props.block ?
      css`
        display: block, `
    : ""},
`
