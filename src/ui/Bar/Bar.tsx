import React, { ReactNode } from "react";
import { BarContainer } from "./Bar.styled";

interface BarProps {
  children: ReactNode;
  align?: "center" | "space-between";
}

const Bar: React.FC<BarProps> = ({ children, align = "center" }) => {
  return <BarContainer align={align}>{children}</BarContainer>;
};

export default Bar;