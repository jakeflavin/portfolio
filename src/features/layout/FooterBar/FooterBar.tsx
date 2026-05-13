import React from "react";
import Bar from "@/ui/Bar";
import { Text } from "./FooterBar.styled";

const FooterBar: React.FC = () => {
  return (
    <Bar align="center">
      <Text>Made with ♥ by Jake Flavin</Text>
    </Bar>
  );
};

export default FooterBar;
