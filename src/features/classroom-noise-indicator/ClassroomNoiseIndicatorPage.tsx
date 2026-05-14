import React, { useEffect, useRef, useState } from "react";
import Button from "@/ui/Button";
import CalculatorPage, {
  ControlsPanel,
  SummaryMessage,
  SummaryPanel,
  SummaryRow
} from "@/features/projects/components/CalculatorPage";
import NoiseMeter from "./NoiseMeter";
import type { Project } from "@/features/projects/projects";

interface ClassroomNoiseIndicatorPageProps {
  project: Project;
}

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getStatusLabel(level: number, isListening: boolean): string {
  if (!isListening) return "Paused";
  if (level < 35) return "Focused";
  if (level < 55) return "Lively";
  if (level < 75) return "Too loud";
  return "Volume alert";
}

const ClassroomNoiseIndicatorPage: React.FC<ClassroomNoiseIndicatorPageProps> = ({ project }) => {
  const [level, setLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopListening = () => {
    if (animationFrameRef.current != null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    setLevel(0);
  };

  useEffect(() => stopListening, []);

  const sampleAudioLevel = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const data = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(data);

    let sum = 0;
    for (const value of data) {
      const centered = (value - 128) / 128;
      sum += centered * centered;
    }

    const rms = Math.sqrt(sum / data.length);
    const normalized = Math.min(100, Math.round(rms * 260));
    setLevel((previous) => Math.round(previous * 0.72 + normalized * 0.28));
    animationFrameRef.current = requestAnimationFrame(sampleAudioLevel);
  };

  const startListening = async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone access is not available in this browser.");
      return;
    }

    try {
      const AudioContextCtor =
        window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      const audioContext = new AudioContextCtor();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.82;

      audioContext.createMediaStreamSource(stream).connect(analyser);
      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setIsListening(true);
      sampleAudioLevel();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start microphone monitoring.");
      stopListening();
    }
  };

  return (
    <CalculatorPage
      title={project.title}
      description={project.description}
      controls={
        <ControlsPanel padding="md" variant="secondary" shadow="mdDown">
          <Button onClick={isListening ? stopListening : startListening}>
            {isListening ? "Stop listening" : "Start listening"}
          </Button>
        </ControlsPanel>
      }
      summary={
        <SummaryPanel padding="md" variant="surface" shadow="md">
          <SummaryRow>
            <span>Status</span>
            <strong>{getStatusLabel(level, isListening)}</strong>
          </SummaryRow>
          <SummaryRow>
            <span>Noise level</span>
            <strong>{isListening ? `${level}%` : "--"}</strong>
          </SummaryRow>
          <SummaryMessage>
            {error ?? "Microphone audio stays in the browser and is only used for the live meter."}
          </SummaryMessage>
        </SummaryPanel>
      }
    >
      <NoiseMeter level={level} isListening={isListening} />
    </CalculatorPage>
  );
};

export default ClassroomNoiseIndicatorPage;
