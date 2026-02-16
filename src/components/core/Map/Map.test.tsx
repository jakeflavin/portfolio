import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../../test/test-utils";
import Map from "./Map";

vi.mock("react-map-gl/mapbox", () => ({
  default: function MockMapboxMap(props: { children?: React.ReactNode }) {
    return (
      <div data-testid="mapbox-map">
        Mock Map
        {props.children}
      </div>
    );
  },
  Source: function MockSource(props: { children?: React.ReactNode }) {
    return <div data-testid="map-source">{props.children}</div>;
  },
  Layer: function MockLayer() {
    return <div data-testid="map-layer" />;
  }
}));

describe("Map", () => {
  it("renders placeholder when no mapbox token is provided", () => {
    render(<Map mapboxAccessToken="" />);
    expect(screen.getByTestId("map-placeholder")).toBeInTheDocument();
    expect(
      screen.getByText(/VITE_MAPBOX_ACCESS_TOKEN|mapboxAccessToken/)
    ).toBeInTheDocument();
  });

  it("renders map when mapboxAccessToken prop is provided", () => {
    render(<Map mapboxAccessToken="test-token" />);
    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument();
    expect(screen.getByText("Mock Map")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <Map mapboxAccessToken="test-token" className="custom-map" />
    );
    const wrapper = container.querySelector(".custom-map");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(
      <Map mapboxAccessToken="test-token" height="400px" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ height: "400px" });
  });

  it("accepts interactive prop without error", () => {
    render(<Map mapboxAccessToken="test-token" interactive={false} />);
    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument();
  });

  it("accepts initialViewState without error", () => {
    render(
      <Map
        mapboxAccessToken="test-token"
        initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 10 }}
      />
    );
    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument();
  });

  it("accepts zoomToUserLocation prop", () => {
    render(
      <Map mapboxAccessToken="test-token" zoomToUserLocation={false} />
    );
    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument();
  });

  it("accepts points prop and renders without error", () => {
    const points = [
      { longitude: -122.4, latitude: 37.8 },
      { longitude: -122.41, latitude: 37.81 }
    ];
    render(
      <Map mapboxAccessToken="test-token" points={points} />
    );
    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument();
  });

  it("accepts onMapClick prop without error", () => {
    const onMapClick = vi.fn();
    render(
      <Map mapboxAccessToken="test-token" onMapClick={onMapClick} />
    );
    expect(screen.getByTestId("mapbox-map")).toBeInTheDocument();
  });
});
