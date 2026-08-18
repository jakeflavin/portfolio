import React from "react";
import { Moon, Sun } from "lucide-react";
import TypeWriter from "@/ui/TypeWriter";
import { BIO_SCRIPT } from "./bio";
import BrandIcon, { type BrandName } from "@/ui/BrandIcon";
import CrownMark from "./CrownMark";
import { PROJECTS } from "@/features/projects/projects";
import {
  Panel,
  Content,
  Identity,
  AvatarRing,
  Avatar,
  IdentityColumn,
  Handle,
  Stats,
  Stat,
  Bio,
  BioTags,
  BioTag,
  Highlights,
  Highlight,
  HighlightRing,
  HighlightFill,
  HighlightLabel
} from "./ProfileHeader.styled";

export interface ProfileHeaderProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  /** Called with a tag when one of the bio hashtags is clicked */
  onTagClick?: (tag: string) => void;
}

const ICON_SIZE = 22;

const SOCIALS: { name: BrandName; href: string; label: string }[] = [
  { name: "threads", href: "https://www.threads.com/@jakeflavin", label: "Threads" },
  { name: "linkedin", href: "https://linkedin.com/in/jakeflavin", label: "LinkedIn" },
  { name: "github", href: "https://github.com/jakeflavin", label: "GitHub" }
];

/**
 * The vanity stat. Not derived from anything — it is the "followers" slot, and the joke is
 * that the ideas outnumber the shipped tools by three orders of magnitude.
 */
const IDEAS = 2319;

/** The counts row. Tools and tags are real manifest data; ideas is the vanity number. */
function useStats() {
  const tags = new Set(PROJECTS.flatMap((project) => project.tags ?? []));
  return [
    { label: PROJECTS.length === 1 ? "tool" : "tools", value: PROJECTS.length },
    { label: tags.size === 1 ? "tag" : "tags", value: tags.size },
    // Grouped, as Instagram formats its counts.
    { label: "ideas", value: IDEAS.toLocaleString("en-US") }
  ];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isDarkMode = false,
  onToggleDarkMode,
  onTagClick
}) => {
  const stats = useStats();
  const tags = [...new Set(PROJECTS.flatMap((project) => project.tags ?? []))].sort();

  return (
    <Panel>
      <Content>
        <Identity>
          <AvatarRing>
            <Avatar>
              <CrownMark />
            </Avatar>
          </AvatarRing>

          <IdentityColumn>
            <Handle>Jake&apos;s Tools</Handle>
            <Stats>
              {stats.map(({ label, value }) => (
                <Stat key={label}>
                  <dd>{value}</dd>
                  <dt>{label}</dt>
                </Stat>
              ))}
            </Stats>
          </IdentityColumn>
        </Identity>

        <Bio>
          <TypeWriter script={BIO_SCRIPT} />
          {tags.length > 0 && (
            <BioTags>
              {tags.map((tag) => (
                <BioTag
                  key={tag}
                  type="button"
                  onClick={() => onTagClick?.(tag)}
                  aria-label={`Filter by ${tag}`}
                >
                  #{tag.replace(/\s+/g, "")}
                </BioTag>
              ))}
            </BioTags>
          )}
        </Bio>

        <Highlights>
          {SOCIALS.map(({ name, href, label }) => (
            <Highlight
              key={name}
              type="button"
              onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
              aria-label={`Open ${label} profile`}
            >
              <HighlightRing>
                <HighlightFill>
                  <BrandIcon name={name} size={ICON_SIZE} />
                </HighlightFill>
              </HighlightRing>
              <HighlightLabel>{label}</HighlightLabel>
            </Highlight>
          ))}
          <Highlight type="button" onClick={onToggleDarkMode} aria-label="Toggle dark mode">
            <HighlightRing>
              <HighlightFill>
                {isDarkMode ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
              </HighlightFill>
            </HighlightRing>
            <HighlightLabel>{isDarkMode ? "Light" : "Dark"}</HighlightLabel>
          </Highlight>
        </Highlights>
      </Content>
    </Panel>
  );
};

export default ProfileHeader;
