import styled, { css } from "styled-components"

type Props = {
  large?: boolean
  block?: boolean
}

export const Icon = styled.svg.attrs({
  xmlns: "http://www.w3.org/2000/svg",
  width: "512",
  height: "512",
  viewBox: "0 0 512 512",
})<Props>`
  width: 1em;
  height: 1em;

  ${(props) =>
    props.large === true
      ? css`
          width: 1.5em;
          height: 1.5em;
        `
      : ""};

  fill: currentColor;
  display: inline-block;
  vertical-align: middle;

  margin: auto;

  ${(props) =>
    props.block === true
      ? css`
          display: block;
        `
      : ""};
`
