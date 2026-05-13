import React from "react";
import TitleDescription from "@/ui/TitleDescription";
import { Layout, LeftColumn, RightColumn } from "./CalculatorPage.styled";

export interface CalculatorPageProps {
  title: string;
  description: string;
  controls: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
}

const CalculatorPage: React.FC<CalculatorPageProps> = ({
  title,
  description,
  controls,
  summary,
  children
}) => (
  <Layout>
    <LeftColumn>
      <TitleDescription title={title} description={description} />
      {controls}
      {summary}
    </LeftColumn>
    <RightColumn>{children}</RightColumn>
  </Layout>
);

export default CalculatorPage;
