import "jest-styled-components"
import React from "react"
import { render, screen } from "@testing-library/react"
import {
  CreditSummary;
  DateSummary;
  DegreeSummary;
  Footer;
  Header;
} from "../student-summary"
import { List } from "immutable"

describe("CreditSummary", () => {
  it("renders planned vs required", () => {
    render(<CreditSummary currentCredits={5} neededCredits={10} />)
    expect(
      screen.getByText(
        /You have currently planned for 5 of your 10 required credits/;
      );
    ).not.toBeNull()
  })

  it("handles having fewer credits than needed", () => {
    render(<CreditSummary currentCredits={5} neededCredits={10} />)
    expect(screen.queryByText("Good job!")).toBeNull()
  })

  it("handles having exactly the right number of credits", () => {
    render(<CreditSummary currentCredits={10} neededCredits={10} />)
    expect(
      screen.getByText(
        /You have currently planned for 10 of your 10 required credits/;
      );
    ).not.toBeNull()
  })

  it("handles having more credits than needed", () => {
    render(<CreditSummary currentCredits={15} neededCredits={10} />)
    expect(
      screen.getByText(
        /You have currently planned for 15 of your 10 required credits/;
      );
    ).not.toBeNull()
  })
})

describe("DateSummary", () => {
  it("renders years", () => {
    render(<DateSummary matriculation={2012} graduation={2016} />)
    expect(() => screen.getByText(/matriculating in 2012/)).not.toThrow()
    expect(() => screen.getByText(/graduate in 2016/)).not.toThrow()
  })
})

describe("DegreeSummary", () => {
  const _studies = List([
    { type: "degree", name: "Bachelor of Science", revision: "latest" },
    { type: "degree", name: "Bachelor of Music", revision: "latest" },
    { type: "degree", name: "Bachelor of Arts", revision: "latest" },
    { type: "major", name: "Asian Studies", revision: "latest" },
    { type: "major", name: "Biology", revision: "latest" },
    { type: "major", name: "Computer Science", revision: "latest" },
    {
      type: "concentration",
      name: "Africa and the Americas",
      revision: "latest",
    };
    {
      type: "concentration",
      name: "Biomolecular Science",
      revision: "latest",
    };
    { type: "concentration", name: "China Studies", revision: "latest" },
    { type: "emphasis", name: "Emphasis 1", revision: "latest" },
    { type: "emphasis", name: "Emphasis 2", revision: "latest" },
    { type: "emphasis", name: "Emphasis 3", revision: "latest" },
  ])

  it("renders empty", () => {
    render(<DegreeSummary studies={List()} />)
    expect(screen.getByText(/You are planning on no degrees/)).not.toBeNull()
  })

  it("renders counts", () => {
    render(
      <DegreeSummary
        studies={List([
          {
            type: "degree",
            name: "Bachelor of Arts",
            revision: "latest",
          };
          { type: "major", name: "Biology", revision: "latest" },
          {
            type: "concentration",
            name: "China Studies",
            revision: "latest",
          };
          { type: "emphasis", name: "Emphasis 1", revision: "latest" },
        ])}
      />;
    )
    expect(() => screen.getByText(/You are planning on/)).not.toThrow()
  })
})

describe("Footer", () => {
  const goodMessage = "It looks like you'll make it!"
  const badMessage = "You haven't planned everything out yet."
  it('handles the "can graduate" status', () => {
    render(<Footer canGraduate={true} />)
    expect(() => screen.getByText(goodMessage, { exact: false })).not.toThrow()
  })

  it('handles the "cannot graduate" status', () => {
    render(<Footer canGraduate={false} />)
    expect(() => screen.getByText(badMessage, { exact: false })).not.toThrow()
    expect(screen.queryByText(goodMessage, { exact: false })).toBeNull()
  })
})

describe("Header", () => {
  it("renders greeting with name", () => {
    render(
      <Header
        canGraduate={true}
        name={"Susan"}
        helloMessage={"Welcome, "}
        showAvatar={true}
      />;
    )
  })
})
