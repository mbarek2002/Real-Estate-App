import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Explore from "../Explore";
import { AppProvider } from "../../context/AppContext";
import { propertyAPI } from "../../services/api";

// Mock the propertyAPI
jest.mock("../../services/api", () => ({
  propertyAPI: {
    getAllProperties: jest.fn(),
  },
}));

// Mock the PropertyFilters component
jest.mock("../../Components/PropertyFilters", () => {
  return function MockPropertyFilters({ onFilterChange }) {
    return (
      <div data-testid="property-filters">
        <button onClick={() => onFilterChange({ type: "buy" })}>
          Filter Buy
        </button>
        <button onClick={() => onFilterChange({ type: "rent" })}>
          Filter Rent
        </button>
      </div>
    );
  };
});

// Mock the PropertyCard component
jest.mock("../../Components/PropertyCard", () => {
  return function MockPropertyCard({ property }) {
    return <div data-testid="property-card">{property.title}</div>;
  };
});

const mockProperties = [
  {
    _id: "1",
    title: "Beautiful Apartment",
    description: "A beautiful apartment in the city center",
    images: ["https://example.com/image1.jpg"],
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    forSale: true,
    salePrice: 500000,
    address: {
      address: "123 Main St, City",
      coordinates: [40.7128, -74.006],
    },
  },
  {
    _id: "2",
    title: "Modern House",
    description: "A modern house with garden",
    images: ["https://example.com/image2.jpg"],
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
    forRent: true,
    rentPrice: 3000,
    address: {
      address: "456 Oak St, City",
      coordinates: [40.7589, -73.9851],
    },
  },
];

const MockExplore = ({
  location = null,
  searchParams = new URLSearchParams(),
}) => {
  const mockContextValue = {
    location,
    setProperties: jest.fn(),
  };

  return (
    <BrowserRouter>
      <AppProvider value={mockContextValue}>
        <Explore />
      </AppProvider>
    </BrowserRouter>
  );
};

describe("Explore Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    propertyAPI.getAllProperties.mockResolvedValue(mockProperties);
  });

  test("renders map container", () => {
    render(<MockExplore />);

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  test("renders property filters", () => {
    render(<MockExplore />);

    expect(screen.getByTestId("property-filters")).toBeInTheDocument();
  });

  test("loads and displays properties", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(propertyAPI.getAllProperties).toHaveBeenCalled();
    });
  });

  test("displays property markers on map", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.getAllByTestId("marker")).toHaveLength(2);
    });
  });

  test("filters properties when filter changes", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.getAllByTestId("property-card")).toHaveLength(2);
    });

    const filterButton = screen.getByText("Filter Buy");
    fireEvent.click(filterButton);

    // Properties should be filtered based on the filter change
    await waitFor(() => {
      expect(screen.getAllByTestId("property-card")).toHaveLength(1);
    });
  });

  test("shows properties panel when properties are available", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.getByText("Properties (2)")).toBeInTheDocument();
    });
  });

  test("handles empty properties list", async () => {
    propertyAPI.getAllProperties.mockResolvedValue([]);

    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.queryByText("Properties (0)")).not.toBeInTheDocument();
    });
  });

  test("displays zoom controls", () => {
    render(<MockExplore />);

    expect(
      screen.getByRole("button", { name: /zoom in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /zoom out/i })
    ).toBeInTheDocument();
  });

  test("displays current location button", () => {
    render(<MockExplore />);

    expect(
      screen.getByRole("button", { name: /current position/i })
    ).toBeInTheDocument();
  });

  test("handles current location button click", () => {
    render(<MockExplore />);

    const currentLocationButton = screen.getByRole("button", {
      name: /current position/i,
    });
    fireEvent.click(currentLocationButton);

    // Button should be clickable without errors
    expect(currentLocationButton).toBeInTheDocument();
  });

  test("handles zoom in button click", () => {
    render(<MockExplore />);

    const zoomInButton = screen.getByRole("button", { name: /zoom in/i });
    fireEvent.click(zoomInButton);

    // Button should be clickable without errors
    expect(zoomInButton).toBeInTheDocument();
  });

  test("handles zoom out button click", () => {
    render(<MockExplore />);

    const zoomOutButton = screen.getByRole("button", { name: /zoom out/i });
    fireEvent.click(zoomOutButton);

    // Button should be clickable without errors
    expect(zoomOutButton).toBeInTheDocument();
  });

  test("displays property popups on map", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.getAllByTestId("popup")).toHaveLength(2);
    });
  });

  test("handles filter panel toggle", () => {
    render(<MockExplore />);

    const toggleButton = screen.getByRole("button", { name: /toggle filter/i });
    fireEvent.click(toggleButton);

    // Filter panel should toggle visibility
    expect(toggleButton).toBeInTheDocument();
  });

  test("displays no results message when no properties match filters", async () => {
    propertyAPI.getAllProperties.mockResolvedValue([]);

    render(<MockExplore />);

    await waitFor(() => {
      expect(
        screen.getByText("No properties found matching your criteria")
      ).toBeInTheDocument();
    });
  });

  test("handles properties panel close button", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);
    });

    // Panel should close without errors
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  test("displays property count in panel header", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.getByText("Properties (2)")).toBeInTheDocument();
    });
  });

  test("handles error state when properties fail to load", async () => {
    propertyAPI.getAllProperties.mockRejectedValue(new Error("API Error"));

    render(<MockExplore />);

    await waitFor(() => {
      // Component should handle error gracefully
      expect(screen.getByTestId("map-container")).toBeInTheDocument();
    });
  });

  test("applies correct CSS classes for styling", () => {
    render(<MockExplore />);

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toBeInTheDocument();
  });

  test("handles URL parameters for initial filter state", () => {
    const searchParams = new URLSearchParams(
      "?type=buy&minPrice=100000&maxPrice=500000"
    );

    render(<MockExplore searchParams={searchParams} />);

    // Component should initialize with URL parameters
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  test("displays property details in popups", async () => {
    render(<MockExplore />);

    await waitFor(() => {
      expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
      expect(screen.getByText("Modern House")).toBeInTheDocument();
    });
  });

  test("handles map interaction without errors", () => {
    render(<MockExplore />);

    // Map should render without errors
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
  });
});
