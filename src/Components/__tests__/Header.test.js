import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";
import { AppProvider } from "../../context/AppContext";

// Mock the NavBar component
jest.mock("../NavBar", () => {
  return function MockNavBar({ containerStyles }) {
    return (
      <div data-testid="navbar" className={containerStyles}>
        Mock NavBar
      </div>
    );
  };
});

// Mock the logo import
jest.mock("../../assets/logo.png", () => "mock-logo.png");

const MockHeader = ({ user = null, isAuthenticated = false }) => {
  const mockContextValue = {
    user,
    isAuthenticated,
    location: { latitude: 40.7128, longitude: -74.006 },
  };

  return (
    <BrowserRouter>
      <AppProvider value={mockContextValue}>
        <Header />
      </AppProvider>
    </BrowserRouter>
  );
};

describe("Header Component", () => {
  test("renders Convergimmob logo and brand name", () => {
    render(<MockHeader />);

    expect(screen.getByText("Convergimmob")).toBeInTheDocument();
    expect(screen.getByAltText("Convergimmob Logo")).toBeInTheDocument();
  });

  test("renders mobile menu button on mobile", () => {
    render(<MockHeader />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  test("toggles mobile menu when menu button is clicked", async () => {
    render(<MockHeader />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toHaveClass(
        "flex items-start flex-col gap-y-4 fixed top-20 right-4"
      );
    });
  });

  test("shows login and register buttons when user is not authenticated", () => {
    render(<MockHeader />);

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("shows user profile when user is authenticated", () => {
    const mockUser = {
      id: "123",
      fullName: "John Doe",
      email: "john@example.com",
    };

    render(<MockHeader user={mockUser} isAuthenticated={true} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  test("logo links to home page", () => {
    render(<MockHeader />);

    const logoLink = screen.getByRole("link", { name: /convergimmob/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  test("login button links to login page", () => {
    render(<MockHeader />);

    const loginLink = screen.getByRole("link", { name: "Login" });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("register button links to register page", () => {
    render(<MockHeader />);

    const registerLink = screen.getByRole("link", { name: "Register" });
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("profile button links to profile page when authenticated", () => {
    const mockUser = {
      id: "123",
      fullName: "John Doe",
      email: "john@example.com",
    };

    render(<MockHeader user={mockUser} isAuthenticated={true} />);

    const profileLink = screen.getByRole("link", { name: /john doe/i });
    expect(profileLink).toHaveAttribute("href", "/profile");
  });

  test("applies correct styling classes", () => {
    render(<MockHeader />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("fixed top-0 left-0 w-full z-50 bg-transparent");
  });

  test("handles menu animation correctly", async () => {
    render(<MockHeader />);

    const menuButton = screen.getByRole("button", { name: /menu/i });

    // Click to open menu
    fireEvent.click(menuButton);

    await waitFor(() => {
      const closeButton = screen.getByRole("button", { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
