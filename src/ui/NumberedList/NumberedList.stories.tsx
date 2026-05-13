import type { Meta, StoryObj } from "@storybook/react";
import NumberedList from "./NumberedList";
import Link from "../Link";

const meta: Meta<typeof NumberedList> = {
  title: "Components/NumberedList",
  component: NumberedList
};

export default meta;
type Story = StoryObj<typeof NumberedList>;

const sampleItems = [
  <Link key="1" title="Google" url="https://google.com" />,
  <Link key="2" title="GitHub" url="https://github.com" />,
  <Link key="3" title="MDN" url="https://developer.mozilla.org" />,
  <Link key="4" title="Stack Overflow" url="https://stackoverflow.com" />,
  <Link key="5" title="npm" url="https://npmjs.com" />
];

export const Default: Story = {
  args: {
    title: "Cool links",
    description: "A short list of useful sites.",
    truncate: 3,
    children: sampleItems
  }
};

export const NoTruncation: Story = {
  args: {
    title: "Short list",
    description: "Fewer items than truncate limit.",
    truncate: 10,
    children: sampleItems.slice(0, 2)
  }
};

export const TextItems: Story = {
  args: {
    title: "Steps",
    description: "Follow these in order.",
    truncate: 2,
    children: [
      <span key="1">First step</span>,
      <span key="2">Second step</span>,
      <span key="3">Third step</span>
    ]
  }
};
