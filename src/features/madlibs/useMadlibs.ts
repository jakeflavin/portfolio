import { useMemo, useState } from "react";
import { MADLIB_STORY_TYPES } from "./madlibStories";
import {
  areMadlibValuesFilled,
  createInitialMadlibValues,
  generateMadlibStory,
  getMadlibStoryOptions
} from "./madlibs.utils";

export function useMadlibs() {
  const [values, setValues] = useState<Record<string, string>>(createInitialMadlibValues);
  const [storyType, setStoryType] = useState(MADLIB_STORY_TYPES[0].value);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);

  const allFilled = useMemo(() => areMadlibValuesFilled(values), [values]);
  const storyOptions = useMemo(() => getMadlibStoryOptions(), []);

  const generateStory = () => {
    if (!allFilled) return;
    setGeneratedStory(generateMadlibStory(storyType, values));
  };

  const updateField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return {
    allFilled,
    generatedStory,
    generateStory,
    setStoryType,
    storyOptions,
    storyType,
    updateField,
    values
  };
}
