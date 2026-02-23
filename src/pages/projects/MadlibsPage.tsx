import React, { useMemo, useState } from "react";
import styled from "styled-components";
import Handlebars from "handlebars";
import TitleDescription from "../../components/core/TitleDescription";
import InputAction from "../../components/core/InputAction";
import Select from "../../components/core/Select";
import Button from "../../components/core/Button";
import type { Project } from "../data/projects";
import {
  MADLIB_STORY_TYPES,
  MADLIB_FIELD_LABELS,
  getMadlibFormKeys
} from "../data/madlibStories";

const FORM_KEYS = getMadlibFormKeys();
const STORY_PLACEHOLDER =
  "Fill out the form and click Generate to see your Mad Lib story here.";

interface MadlibsPageProps {
  project: Project;
}

const MadlibsPage: React.FC<MadlibsPageProps> = ({ project }) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    FORM_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {})
  );
  const [storyType, setStoryType] = useState(MADLIB_STORY_TYPES[0].value);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);

  const allFilled = useMemo(
    () => FORM_KEYS.every((key) => (values[key] ?? "").trim() !== ""),
    [values]
  );

  const storyOptions = useMemo(
    () => MADLIB_STORY_TYPES.map((t) => ({ value: t.value, label: t.label })),
    []
  );

  const handleGenerate = () => {
    const type = MADLIB_STORY_TYPES.find((t) => t.value === storyType);
    if (!type || !allFilled) return;
    const template = Handlebars.compile(type.template);
    const result = template(values);
    setGeneratedStory(result);
  };

  const updateField = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <Container>
      <LeftColumn>
        <TitleDescription title={project.title} description={project.description} />
        <FormPanel>
          <FormFields>
            {FORM_KEYS.map((key) => (
              <InputAction
                key={key}
                label={MADLIB_FIELD_LABELS[key] ?? key}
                value={values[key] ?? ""}
                onChange={updateField(key)}
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
              <Button onClick={handleGenerate} disabled={!allFilled}>
                Generate
              </Button>
            </ButtonWrap>
          </FormFooter>
        </FormPanel>
      </LeftColumn>
      <RightColumn>
        <StoryBox>
          {generatedStory ?? STORY_PLACEHOLDER}
        </StoryBox>
      </RightColumn>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;

  ${({ theme }) => theme.media.md} {
    grid-template-columns: minmax(0, 320px) 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const FormPanel = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.mdDown};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.sm} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const SelectWrap = styled.div`
  width: 100%;
  min-width: 0;
  flex: 1;
`;

const ButtonWrap = styled.div`
  width: 100%;
  min-width: 0;
  flex: 1;
  display: flex;

  & > button {
    flex: 1;
    width: 100%;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 200px;
`;

const StoryBox = styled.div`
  flex: 1;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: 1rem;
  line-height: 1.6;
  font-family: ${({ theme }) => theme.typography.fontFamily.body};
  color: ${({ theme }) => theme.colors.text};
  white-space: pre-wrap;
`;

export default MadlibsPage;
