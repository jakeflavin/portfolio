import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../../test/test-utils";
import LottieViewer from "./LottieViewer";

const mockLottie = vi.hoisted(() =>
  vi.fn(() => <div data-testid="lottie-player">Lottie</div>)
);
vi.mock("react-lottie", () => ({
  default: mockLottie
}));

const minimalAnimation = { v: "5.5", fr: 30, layers: [], w: 100, h: 100 };

describe("LottieViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it("renders empty container when neither animationData nor animationUrl is provided", () => {
    render(<LottieViewer width={200} height={200} />);
    expect(screen.queryByTestId("lottie-player")).not.toBeInTheDocument();
  });

  it("renders Lottie when animationData is provided", () => {
    render(
      <LottieViewer animationData={minimalAnimation} width={200} height={200} />
    );
    expect(screen.getByTestId("lottie-player")).toBeInTheDocument();
    expect(mockLottie).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          animationData: minimalAnimation,
          loop: true,
          autoplay: true
        })
      }),
      undefined
    );
  });

  it("fetches and renders when animationUrl is provided", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(minimalAnimation)
    });

    render(
      <LottieViewer animationUrl="/animations/test.json" width={200} height={200} />
    );

    expect(globalThis.fetch).toHaveBeenCalledWith("/animations/test.json");

    await waitFor(() => {
      expect(screen.getByTestId("lottie-player")).toBeInTheDocument();
    });

    expect(mockLottie).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          animationData: minimalAnimation
        })
      }),
      undefined
    );
  });

  it("renders empty container when fetch fails", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(
      <LottieViewer animationUrl="/animations/missing.json" width={200} height={200} />
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    expect(screen.queryByTestId("lottie-player")).not.toBeInTheDocument();
  });

  it("applies width and height as inline styles", () => {
    const { container } = render(
      <LottieViewer
        animationData={minimalAnimation}
        width="100%"
        height="50vh"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "100%", height: "50vh" });
  });

  it("converts number width/height to px", () => {
    const { container } = render(
      <LottieViewer animationData={minimalAnimation} width={300} height={150} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: "300px", height: "150px" });
  });
});
