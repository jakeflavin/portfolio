import React, { useEffect, useState } from "react";
import LottieModule from "react-lottie";
import { Container, LottieInner } from "./LottieViewer.styled";

// Vite/ESM can expose CJS modules as { default: Component }; use the component.
const Lottie = (LottieModule as unknown as { default?: typeof LottieModule })
  .default ?? LottieModule;

/** Lottie animation JSON (export from After Effects / LottieFiles). */
export type LottieAnimationData = object;

export interface LottieViewerProps {
  /** Lottie animation JSON object. Provide this or animationUrl. */
  animationData?: LottieAnimationData;
  /** URL to load Lottie JSON from. Provide this or animationData. */
  animationUrl?: string;
  width?: number | string;
  height?: number | string;
}

function LottieViewer({
  animationData: animationDataProp,
  animationUrl,
  width = 400,
  height = 400,
}: LottieViewerProps) {
  const [fetchedData, setFetchedData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    if (!animationUrl) return;
    let cancelled = false;
    fetch(animationUrl)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setFetchedData(data);
      })
      .catch(() => {
        if (!cancelled) setFetchedData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [animationUrl]);

  const animationData = animationDataProp ?? fetchedData;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sizeStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (!animationData) {
    return <Container style={sizeStyle} />;
  }

  return (
    <Container style={sizeStyle}>
      <LottieInner>
        <Lottie
          options={defaultOptions}
          height="100%"
          width="100%"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </LottieInner>
    </Container>
  );
}

export default LottieViewer;