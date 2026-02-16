import type { Meta, StoryObj } from "@storybook/react";
import Map from "./Map";

const meta: Meta<typeof Map> = {
  title: "Components/Map",
  component: Map,
  parameters: {
    docs: {
      description: {
        component:
          "Map uses Mapbox via react-map-gl. Set VITE_MAPBOX_ACCESS_TOKEN in .env or pass mapboxAccessToken to display the map. By default the map zooms to the user's location; set zoomToUserLocation to false to use initialViewState only. Use the interactive prop to enable or disable pan/zoom."
      }
    }
  },
  argTypes: {
    interactive: {
      control: "boolean",
      description: "When false, pan and zoom are disabled (pointer-events: none)"
    },
    zoomToUserLocation: {
      control: "boolean",
      description: "When true (default), request geolocation and zoom the map to the user's location"
    },
    mapboxAccessToken: {
      control: "text",
      description: "Mapbox access token (or set VITE_MAPBOX_ACCESS_TOKEN)"
    },
    height: {
      control: "text",
      description: "CSS height for the map wrapper"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Map>;

export const Default: Story = {
  args: {
    interactive: true,
    height: "400px"
  }
};

export const NonInteractive: Story = {
  args: {
    interactive: false,
    height: "400px"
  }
};

export const CustomView: Story = {
  args: {
    interactive: true,
    zoomToUserLocation: false,
    height: "400px",
    initialViewState: {
      longitude: -122.4194,
      latitude: 37.7749,
      zoom: 10
    }
  }
};

export const NoZoomToUser: Story = {
  args: {
    interactive: true,
    zoomToUserLocation: false,
    height: "400px"
  },
  parameters: {
    docs: {
      description: {
        story: "With zoomToUserLocation false, the map stays at initialViewState (default US center)."
      }
    }
  }
};

export const WithTokenPlaceholder: Story = {
  args: {
    mapboxAccessToken: "",
    height: "300px"
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no token is provided, a placeholder message is shown. Add VITE_MAPBOX_ACCESS_TOKEN to .env to see the real map in Storybook."
      }
    }
  }
};

export const WithPointsAndLine: Story = {
  args: {
    height: "400px",
    zoomToUserLocation: false,
    initialViewState: {
      longitude: -122.4194,
      latitude: 37.7749,
      zoom: 12
    },
    points: [
      { longitude: -122.42, latitude: 37.77 },
      { longitude: -122.41, latitude: 37.775 },
      { longitude: -122.40, latitude: 37.78 }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Points are passed from the parent; the map draws markers at each point and a line between them. Parent can manage points for total miles, delete, etc."
      }
    }
  }
};
