import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import Bar from "@/ui/Bar";
import IconButton from "@/ui/IconButton";
import { HouseIcon, LinkedinLogoIcon, GithubLogoIcon, ThreadsLogoIcon, MoonIcon } from "@phosphor-icons/react";
import { IconGroup } from "./NavBar.styled";

export interface NavBarProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Bar align="space-between">
      <IconButton
        icon={<HouseIcon size={20} />}
        color={theme.colors.text}
        onClick={() => navigate("/")}
        ariaLabel="Go to home"
      />
      <IconGroup>
        <IconButton
          icon={<ThreadsLogoIcon size={20} />}
          color={theme.colors.text}
          onClick={() =>
            window.open("https://www.threads.com/@jakeflavin", "_blank", "noopener,noreferrer")
          }
          ariaLabel="Open Threads profile"
        />
        <IconButton
          icon={<LinkedinLogoIcon size={20} />}
          color={theme.colors.text}
          onClick={() =>
            window.open("https://linkedin.com/in/jakeflavin", "_blank", "noopener,noreferrer")
          }
          ariaLabel="Open LinkedIn profile"
        />
        <IconButton
          icon={<GithubLogoIcon size={20} />}
          color={theme.colors.text}
          onClick={() =>
            window.open("https://github.com/jakeflavin", "_blank", "noopener,noreferrer")
          }
          ariaLabel="Open GitHub profile"
        />
        <IconButton
          icon={<MoonIcon size={20} />}
          activeIcon={<MoonIcon size={20} weight="fill" />}
          active={isDarkMode}
          color={theme.colors.text}
          onClick={onToggleDarkMode}
          ariaLabel="Toggle dark mode"
        />
      </IconGroup>
    </Bar>
  );
};

export default NavBar;
