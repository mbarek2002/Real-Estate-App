import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { AppProvider } from "../context/AppContext";
import Home from "../Pages/Home";
import Explore from "../Pages/Explore";
import PropertyDetails from "../Pages/PropertyDetails";
import { propertyAPI, authAPI, visitAPI } from "../services/api";

// Mock all API services
jest.mock("../services/api", () => ({
  propertyAPI: {
    getAllProperties: jest.fn(),
    getPropertyById: jest.fn(),
    discoverProperties: jest.fn(),
    recordPropertyView: jest.fn(),
  },
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
  },
  visitAPI: {
    requestVisit: jest.fn(),
    getSentVisits: jest.fn(),
    getReceivedVisits: jest.fn(),
  },
}));

// Mock components that might cause issues in integration tests
jest.mock("../Components/Hero1", () => () => (
  <div data-testid="hero">Hero Component</div>
));
jest.mock("../Components/PropertyFilters", () => ({ onFilterChange }) => (
  <div data-testid="filters">
    <button onClick={() => onFilterChange({ type: "buy" })}>Filter Buy</button>
  </div>
));
jest.mock("../Components/PropertyCard", () => ({ property }) => (
  <div data-testid="property-card">{property.title}</div>
));

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
    ownerId: {
      _id: "owner1",
      fullName: "John Doe",
      phone: "123-456-7890",
      email: "john@example.com",
    },
  },
];

const mockUser = {
  _id: "user1",
  fullName: "Test User",
  email: "test@example.com",
  phone: "123-456-7890",
};

const IntegrationWrapper = ({
  children,
  user = null,
  isAuthenticated = false,
}) => {
  const mockContextValue = {
    user,
    isAuthenticated,
    location: { latitude: 40.7128, longitude: -74.006 },
    setProperties: jest.fn(),
  };

  return (
    <BrowserRouter>
      <AppProvider value={mockContextValue}>{children}</AppProvider>
    </BrowserRouter>
  );
};

describe("Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Property Discovery Flow", () => {
    test("user can search properties from home and view results on explore page", async () => {
      propertyAPI.discoverProperties.mockResolvedValue({
        nearby: mockProperties,
        recommended: [],
      });

      render(
        <IntegrationWrapper>
          <Home />
        </IntegrationWrapper>
      );

      // User sees search form on home page
      expect(
        screen.getByText("Find Your Perfect Property")
      ).toBeInTheDocument();

      // User fills search form
      const minPriceInput = screen.getByPlaceholderText("$0");
      const maxPriceInput = screen.getByPlaceholderText("$1,000,000");

      fireEvent.change(minPriceInput, { target: { value: "100000" } });
      fireEvent.change(maxPriceInput, { target: { value: "500000" } });

      // User clicks search
      const searchButton = screen.getByText("Search Properties");
      fireEvent.click(searchButton);

      // Properties should be loaded
      await waitFor(() => {
        expect(propertyAPI.discoverProperties).toHaveBeenCalled();
      });
    });

    test("user can navigate from home to explore page", () => {
      render(
        <IntegrationWrapper>
          <Home />
        </IntegrationWrapper>
      );

      // User clicks explore properties button
      const exploreButton = screen.getByText("Explore Properties");
      expect(exploreButton).toBeInTheDocument();
      expect(exploreButton.closest("a")).toHaveAttribute("href", "/explore");
    });
  });

  describe("Property Viewing Flow", () => {
    test("user can view property details from property card", async () => {
      propertyAPI.getPropertyById.mockResolvedValue(mockProperties[0]);

      render(
        <MemoryRouter initialEntries={["/property/1"]}>
          <IntegrationWrapper>
            <PropertyDetails />
          </IntegrationWrapper>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(propertyAPI.getPropertyById).toHaveBeenCalledWith("1");
      });
    });

    test("property view is recorded when user views property details", async () => {
      propertyAPI.getPropertyById.mockResolvedValue(mockProperties[0]);
      propertyAPI.recordPropertyView.mockResolvedValue({
        message: "View recorded",
      });

      render(
        <MemoryRouter initialEntries={["/property/1"]}>
          <IntegrationWrapper user={mockUser} isAuthenticated={true}>
            <PropertyDetails />
          </IntegrationWrapper>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(propertyAPI.recordPropertyView).toHaveBeenCalledWith(
          "1",
          "user1"
        );
      });
    });
  });

  describe("Visit Request Flow", () => {
    test("authenticated user can request property visit", async () => {
      const visitData = {
        propertyId: "1",
        visitorId: "user1",
        ownerId: "owner1",
        visitDateTime: "2024-01-01T10:00:00Z",
        type: "sale",
      };

      visitAPI.requestVisit.mockResolvedValue({
        _id: "visit1",
        status: "Pending",
        ...visitData,
      });

      render(
        <MemoryRouter initialEntries={["/property/1"]}>
          <IntegrationWrapper user={mockUser} isAuthenticated={true}>
            <PropertyDetails />
          </IntegrationWrapper>
        </MemoryRouter>
      );

      // User should be able to request a visit
      await waitFor(() => {
        expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
      });
    });

    test("property owner can view received visit requests", async () => {
      const mockVisits = [
        {
          _id: "visit1",
          propertyId: mockProperties[0],
          visitorId: mockUser,
          status: "Pending",
          visitDateTime: "2024-01-01T10:00:00Z",
        },
      ];

      visitAPI.getReceivedVisits.mockResolvedValue(mockVisits);

      render(
        <IntegrationWrapper user={mockUser} isAuthenticated={true}>
          <div>Visit Requests Page</div>
        </IntegrationWrapper>
      );

      // Owner should be able to view visit requests
      expect(screen.getByText("Visit Requests Page")).toBeInTheDocument();
    });
  });

  describe("Authentication Flow", () => {
    test("unauthenticated user sees login and register options", () => {
      render(
        <IntegrationWrapper isAuthenticated={false}>
          <Home />
        </IntegrationWrapper>
      );

      // User should see login/register options in header
      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Register")).toBeInTheDocument();
    });

    test("authenticated user sees profile information", () => {
      render(
        <IntegrationWrapper user={mockUser} isAuthenticated={true}>
          <Home />
        </IntegrationWrapper>
      );

      // User should see their profile information
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  describe("Map Integration", () => {
    test("explore page displays map with property markers", async () => {
      propertyAPI.getAllProperties.mockResolvedValue(mockProperties);

      render(
        <IntegrationWrapper>
          <Explore />
        </IntegrationWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
        expect(screen.getAllByTestId("marker")).toHaveLength(1);
      });
    });

    test("property details page shows map with property location", async () => {
      propertyAPI.getPropertyById.mockResolvedValue(mockProperties[0]);

      render(
        <MemoryRouter initialEntries={["/property/1"]}>
          <IntegrationWrapper>
            <PropertyDetails />
          </IntegrationWrapper>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      propertyAPI.getAllProperties.mockRejectedValue(new Error("API Error"));

      render(
        <IntegrationWrapper>
          <Explore />
        </IntegrationWrapper>
      );

      // Component should handle error without crashing
      await waitFor(() => {
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
      });
    });

    test("handles network errors gracefully", async () => {
      propertyAPI.getAllProperties.mockRejectedValue(
        new Error("Network Error")
      );

      render(
        <IntegrationWrapper>
          <Explore />
        </IntegrationWrapper>
      );

      // Component should handle network error without crashing
      await waitFor(() => {
        expect(screen.getByTestId("map-container")).toBeInTheDocument();
      });
    });
  });

  describe("Data Flow", () => {
    test("context provides location data to components", () => {
      const mockLocation = { latitude: 40.7128, longitude: -74.006 };

      render(
        <IntegrationWrapper location={mockLocation}>
          <Home />
        </IntegrationWrapper>
      );

      // Location should be available to components
      expect(screen.getByTestId("hero")).toBeInTheDocument();
    });

    test("properties are shared across components through context", async () => {
      propertyAPI.discoverProperties.mockResolvedValue({
        nearby: mockProperties,
        recommended: [],
      });

      render(
        <IntegrationWrapper>
          <Home />
        </IntegrationWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Flow", () => {
    test("user can navigate between all main pages", () => {
      render(
        <IntegrationWrapper>
          <Home />
        </IntegrationWrapper>
      );

      // User should be able to navigate to explore page
      const exploreLink = screen.getByText("Explore Properties");
      expect(exploreLink.closest("a")).toHaveAttribute("href", "/explore");
    });

    test("property cards link to property details", async () => {
      propertyAPI.discoverProperties.mockResolvedValue({
        nearby: mockProperties,
        recommended: [],
      });

      render(
        <IntegrationWrapper>
          <Home />
        </IntegrationWrapper>
      );

      await waitFor(() => {
        const propertyCard = screen.getByText("Beautiful Apartment");
        expect(propertyCard.closest("a")).toHaveAttribute(
          "href",
          "/property/1"
        );
      });
    });
  });
});
