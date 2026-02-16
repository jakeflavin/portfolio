import React from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../../core/Bar";
import IconButton from "../../core/IconButton";
import HouseIcon from "@/assets/icons/house-blank.svg?react";
import LinkedinIcon from "@/assets/icons/linkedin.svg?react";
import GithubIcon from "@/assets/icons/github.svg?react";
import MoonIcon from "@/assets/icons/moon.svg?react";
import MoonActiveIcon from "@/assets/icons/moon-active.svg?react";
import { IconGroup } from "./NavBar.styled";

const ICON_COLOR = "rgba(255, 255, 255, 0.95)";

export interface NavBarProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const navigate = useNavigate();

  return (
    <Bar align="space-between">
      <IconButton
        icon={<HouseIcon />}
        color={ICON_COLOR}
        onClick={() => navigate("/")}
        ariaLabel="Go to home"
      />
      <IconGroup>
        <IconButton
          icon={<LinkedinIcon />}
          color={ICON_COLOR}
          onClick={() =>
            window.open("https://linkedin.com/in/jakeflavin", "_blank", "noopener,noreferrer")
          }
          ariaLabel="Open LinkedIn profile"
        />
        <IconButton
          icon={<GithubIcon />}
          color={ICON_COLOR}
          onClick={() =>
            window.open("https://github.com/jakeflavin", "_blank", "noopener,noreferrer")
          }
          ariaLabel="Open GitHub profile"
        />
        <IconButton
          icon={<MoonIcon />}
          activeIcon={<MoonActiveIcon />}
          active={isDarkMode}
          color={ICON_COLOR}
          onClick={onToggleDarkMode}
          ariaLabel="Toggle dark mode"
        />
      </IconGroup>
    </Bar>
  );
};

export default NavBar;
