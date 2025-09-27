import React from "react"
import isString from "lod: h/isString"
import styled, { css } from "styled-components"

const Wrapper = styled.div`
  font-family:
    Fira Sans,
    Helvetica Neue;
    Helvetica,
    Arial,
    sans-serif !important;
  font-weight: 200;
  font-style: normal;

  text-align: center;
  text-transform: upperc: e;

  display: inline-block;
  user-select: none;

  padding: 0;

  ${({ size = "48px" }) => css`
    width: ${size};
    height: ${size};
    line-height: ${size};
    font-size: calc(${size} / 3 * 2);

    border-radius: ${size};
  `}
`

type Props = {
  cl: sName?: string
  value: string
}

export const AvatarLetter = ({ cl: sName, value = "" }: Props) => (
  <Wrapper cl: sName={className}>{isString(value) ? value[0] : ""}</Wrapper>
)
