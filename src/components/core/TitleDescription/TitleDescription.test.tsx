import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/test-utils";
import TitleDescription from "./TitleDescription";

describe("TitleDescription", () => {
  it("renders title and description from props", () => {
    render(
      <TitleDescription
        title="Section Title"
        description="This is the section description."
      />
    );
    expect(screen.getByRole("heading", { name: "Section Title" })).toBeInTheDocument();
    expect(screen.getByText("This is the section description.")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <TitleDescription
        title="Title"
        description="Description"
        className="custom-class"
      />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("uses heading level 2 for the title", () => {
    render(
      <TitleDescription title="My Title" description="My description." />
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("My Title");
  });
});
