import React from "react";
import Bar from "@/ui/Bar";
import { Text, Heart } from "./FooterBar.styled";

const FooterBar: React.FC = () => {
  return (
    <Bar align="center">
      <Text>Made with <Heart>♥</Heart> by Jake Flavin</Text>
    </Bar>
  );
};

export default FooterBar;
