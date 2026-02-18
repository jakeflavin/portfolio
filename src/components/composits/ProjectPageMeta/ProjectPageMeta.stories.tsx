import type { Meta, StoryObj } from "@storybook/react";
import ProjectPageMeta from "./ProjectPageMeta";
import type { Project } from "../../../pages/data/projects";

const mockProject: Project = {
  id: "story-1",
  creationDate: new Date("2026-02-01"),
  disabled: false,
  title: "Sample Project",
  type: "project",
  imageSrc: "/images/sample.png",
  description: "This is a sample project used in Storybook. The meta wrapper sets Open Graph and Twitter Card tags for this page.",
  path: "/projects/sample",
  external: false
};

const meta: Meta<typeof ProjectPageMeta> = {
  title: "Composits/ProjectPageMeta",
  component: ProjectPageMeta
};

export default meta;
type Story = StoryObj<typeof ProjectPageMeta>;

export const Default: Story = {
  args: {
    project: mockProject,
    children: (
      <div style={{ padding: "1rem", border: "1px dashed #ccc" }}>
        Project page content would render here. Check the document title and
        &lt;head&gt; meta tags (og:*, twitter:*) when this story is active.
      </div>
    )
  }
};
