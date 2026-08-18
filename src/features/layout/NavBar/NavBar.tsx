import React from "react";
import { useTheme } from "styled-components";
import { Moon, Sun } from "lucide-react";
import Bar from "@/ui/Bar";
import IconButton from "@/ui/IconButton";
import BrandIcon, { type BrandName } from "@/ui/BrandIcon";
import { IconGroup, Wordmark, Divider } from "./NavBar.styled";

export interface NavBarProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const ICON_SIZE = 18;

const SOCIALS: { name: BrandName; href: string; label: string }[] = [
  { name: "threads", href: "https://www.threads.com/@jakeflavin", label: "Open Threads profile" },
  { name: "linkedin", href: "https://linkedin.com/in/jakeflavin", label: "Open LinkedIn profile" },
  { name: "github", href: "https://github.com/jakeflavin", label: "Open GitHub profile" }
];

const NavBar: React.FC<NavBarProps> = ({ isDarkMode = false, onToggleDarkMode }) => {
  const theme = useTheme();

  return (
    <Bar align="space-between">
      <Wordmark>Jake&apos;s Tools</Wordmark>
      <IconGroup>
        {SOCIALS.map(({ name, href, label }) => (
          <IconButton
            key={name}
            icon={<BrandIcon name={name} size={ICON_SIZE} />}
            size={ICON_SIZE}
            color={theme.colors.text}
            onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
            ariaLabel={label}
          />
        ))}
        <Divider aria-hidden="true" />
        <IconButton
          icon={isDarkMode ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
          size={ICON_SIZE}
          color={theme.colors.text}
          onClick={onToggleDarkMode}
          ariaLabel="Toggle dark mode"
        />
      </IconGroup>
    </Bar>
  );
};

export default NavBar;
