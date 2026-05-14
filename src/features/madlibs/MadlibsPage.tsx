import React from "react";
import TitleDescription from "@/ui/TitleDescription";
import InputAction from "@/ui/InputAction";
import Select from "@/ui/Select";
import Button from "@/ui/Button";
import type { Project } from "@/features/projects/projects";
import { MADLIB_FIELD_LABELS } from "./madlibStories";
import {
  ButtonWrap,
  Container,
  FormFields,
  FormFooter,
  FormPanel,
  LeftColumn,
  RightColumn,
  SelectWrap,
  StoryBox
} from "./MadlibsPage.styled";
import { FORM_KEYS, STORY_PLACEHOLDER } from "./madlibs.utils";
import { useMadlibs } from "./useMadlibs";

interface MadlibsPageProps {
  project: Project;
}

const MadlibsPage: React.FC<MadlibsPageProps> = ({ project }) => {
  const {
    allFilled,
    generatedStory,
    generateStory,
    setStoryType,
    storyOptions,
    storyType,
    updateField,
    values
  } = useMadlibs();

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <FormPanel padding="md" variant="secondary" shadow="mdDown">
          <FormFields>
            {FORM_KEYS.map((key) => (
              <InputAction
                key={key}
                label={MADLIB_FIELD_LABELS[key] ?? key}
                value={values[key] ?? ""}
                onChange={(event) => updateField(key, event.target.value)}
                placeholder={`Enter ${MADLIB_FIELD_LABELS[key]?.toLowerCase() ?? key}...`}
              />
            ))}
          </FormFields>
          <FormFooter>
            <SelectWrap>
              <Select
                options={storyOptions}
                value={storyType}
                onChange={(v) => setStoryType(v)}
                aria-label="Story type"
                fullWidth
              />
            </SelectWrap>
            <ButtonWrap>
              <Button onClick={generateStory} disabled={!allFilled}>
                Generate
              </Button>
            </ButtonWrap>
          </FormFooter>
        </FormPanel>
      </LeftColumn>
      <RightColumn>
        <StoryBox padding="lg" variant="secondary" shadow="md">
          {generatedStory ?? STORY_PLACEHOLDER}
        </StoryBox>
      </RightColumn>
    </Container>
  );
};

export default MadlibsPage;
