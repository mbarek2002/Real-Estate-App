import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PropertyCard from "../PropertyCard";

const mockProperty = {
  _id: "123",
  title: "Beautiful Apartment",
  description: "A beautiful apartment in the city center",
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  area: 120,
  bedrooms: 3,
  bathrooms: 2,
  forSale: true,
  forRent: false,
  salePrice: 500000,
  rentPrice: null,
  address: {
    address: "123 Main St, City",
    coordinates: [40.7128, -74.006],
  },
  hasParking: true,
  hasSwimmingPool: false,
  hasGym: true,
  hasElevator: true,
  ownerId: {
    _id: "456",
    fullName: "John Doe",
    phone: "123-456-7890",
    email: "john@example.com",
  },
};

const MockPropertyCard = ({ property = mockProperty, filters = {} }) => (
  <BrowserRouter>
    <PropertyCard property={property} filters={filters} />
  </BrowserRouter>
);

describe("PropertyCard Component", () => {
  test("renders property information correctly", () => {
    render(<MockPropertyCard />);

    expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
    expect(
      screen.getByText("A beautiful apartment in the city center")
    ).toBeInTheDocument();
    expect(screen.getByText("120 m²")).toBeInTheDocument();
    expect(screen.getByText("3 bedrooms")).toBeInTheDocument();
    expect(screen.getByText("2 bathrooms")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, City")).toBeInTheDocument();
  });

  test("displays sale price when property is for sale", () => {
    render(<MockPropertyCard />);

    expect(screen.getByText("$500,000")).toBeInTheDocument();
    expect(screen.getByText("For Sale")).toBeInTheDocument();
  });

  test("displays rent price when property is for rent", () => {
    const rentProperty = {
      ...mockProperty,
      forSale: false,
      forRent: true,
      salePrice: null,
      rentPrice: 2000,
    };

    render(<MockPropertyCard property={rentProperty} />);

    expect(screen.getByText("$2,000")).toBeInTheDocument();
    expect(screen.getByText("For Rent")).toBeInTheDocument();
  });

  test("displays amenities correctly", () => {
    render(<MockPropertyCard />);

    expect(screen.getByText("Parking")).toBeInTheDocument();
    expect(screen.getByText("Gym")).toBeInTheDocument();
    expect(screen.getByText("Elevator")).toBeInTheDocument();
    expect(screen.queryByText("Swimming Pool")).not.toBeInTheDocument();
  });

  test("renders property image", () => {
    render(<MockPropertyCard />);

    const image = screen.getByAltText("Beautiful Apartment");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
  });

  test("links to property details page", () => {
    render(<MockPropertyCard />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/property/123");
  });

  test("handles missing images gracefully", () => {
    const propertyWithoutImages = {
      ...mockProperty,
      images: [],
    };

    render(<MockPropertyCard property={propertyWithoutImages} />);

    expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
  });

  test("handles missing address gracefully", () => {
    const propertyWithoutAddress = {
      ...mockProperty,
      address: {
        address: "",
        coordinates: [0, 0],
      },
    };

    render(<MockPropertyCard property={propertyWithoutAddress} />);

    expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
  });

  test("applies correct CSS classes for styling", () => {
    render(<MockPropertyCard />);

    const card = screen.getByRole("link");
    expect(card).toHaveClass(
      "block h-48 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
    );
  });

  test("displays owner information", () => {
    render(<MockPropertyCard />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("handles both sale and rent properties", () => {
    const bothProperty = {
      ...mockProperty,
      forSale: true,
      forRent: true,
      salePrice: 500000,
      rentPrice: 2000,
    };

    render(<MockPropertyCard property={bothProperty} />);

    expect(screen.getByText("$500,000")).toBeInTheDocument();
    expect(screen.getByText("For Sale")).toBeInTheDocument();
  });

  test("filters properties based on search criteria", () => {
    const filters = {
      type: "buy",
      minPrice: 400000,
      maxPrice: 600000,
      bedrooms: 3,
    };

    render(<MockPropertyCard filters={filters} />);

    // Property should be visible as it matches the filters
    expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
  });

  test("handles property with no amenities", () => {
    const propertyWithoutAmenities = {
      ...mockProperty,
      hasParking: false,
      hasSwimmingPool: false,
      hasGym: false,
      hasElevator: false,
    };

    render(<MockPropertyCard property={propertyWithoutAmenities} />);

    expect(screen.getByText("Beautiful Apartment")).toBeInTheDocument();
    expect(screen.queryByText("Parking")).not.toBeInTheDocument();
    expect(screen.queryByText("Gym")).not.toBeInTheDocument();
  });
});
