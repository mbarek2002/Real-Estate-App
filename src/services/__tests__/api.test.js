import { propertyAPI, authAPI, newsAPI, visitAPI } from "../api";

// Mock fetch
global.fetch = jest.fn();

describe("API Services", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("Property API", () => {
    test("getAllProperties should make correct API call", async () => {
      const mockProperties = [
        { id: 1, title: "Test Property 1" },
        { id: 2, title: "Test Property 2" },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperties,
      });

      const result = await propertyAPI.getAllProperties();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/properties",
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockProperties);
    });

    test("getPropertyById should make correct API call", async () => {
      const mockProperty = { id: 1, title: "Test Property" };
      const propertyId = "123";

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperty,
      });

      const result = await propertyAPI.getPropertyById(propertyId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/users/properties/${propertyId}`,
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockProperty);
    });

    test("discoverProperties should make correct API call with coordinates", async () => {
      const mockResponse = {
        nearby: [{ id: 1, title: "Nearby Property" }],
        recommended: [{ id: 2, title: "Recommended Property" }],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await propertyAPI.discoverProperties(40.7128, -74.006);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/properties/discover?latitude=40.7128&longitude=-74.0060",
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test("recordPropertyView should make correct API call", async () => {
      const propertyId = "123";
      const userId = "456";

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "View recorded" }),
      });

      await propertyAPI.recordPropertyView(propertyId, userId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/users/properties/${propertyId}/view`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    test("addProperty should handle FormData correctly", async () => {
      const propertyData = {
        title: "Test Property",
        description: "Test Description",
        images: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
        ownerId: "123",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Property added successfully" }),
      });

      await propertyAPI.addProperty(propertyData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/properties/",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
    });
  });

  describe("Auth API", () => {
    test("register should make correct API call", async () => {
      const userData = {
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "User registered successfully" }),
      });

      await authAPI.register(userData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/auth/signup",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(userData),
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    test("login should make correct API call", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "mock-token", user: { id: "123" } }),
      });

      await authAPI.login(credentials);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/auth/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    test("getProfile should make correct API call", async () => {
      const email = "test@example.com";
      const mockUser = { id: "123", fullName: "Test User" };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authAPI.getProfile(email);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/auth/verifgmail",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("News API", () => {
    test("getAllNews should make correct API call", async () => {
      const mockNews = [
        { id: 1, title: "News 1", content: "Content 1" },
        { id: 2, title: "News 2", content: "Content 2" },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNews,
      });

      const result = await newsAPI.getAllNews();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/news",
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockNews);
    });
  });

  describe("Visit API", () => {
    test("requestVisit should make correct API call", async () => {
      const visitData = {
        propertyId: "123",
        visitorId: "456",
        ownerId: "789",
        visitDateTime: "2024-01-01T10:00:00Z",
        type: "sale",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Visit request created" }),
      });

      await visitAPI.requestVisit(visitData);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/api/users/visit",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(visitData),
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    test("getSentVisits should make correct API call", async () => {
      const userId = "123";
      const mockVisits = [{ id: 1, propertyId: "456" }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockVisits,
      });

      const result = await visitAPI.getSentVisits(userId);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/users/visit/sent/${userId}`,
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result).toEqual(mockVisits);
    });

    test("updateVisitStatus should make correct API call", async () => {
      const visitId = "123";
      const status = "Approved";
      const ownerNotes = "Approved for visit";

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Visit request updated" }),
      });

      await visitAPI.updateVisitStatus(visitId, status, ownerNotes);

      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/users/visit/${visitId}`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ status, ownerNotes }),
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  describe("Error Handling", () => {
    test("should handle API errors correctly", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Server error" }),
      });

      await expect(propertyAPI.getAllProperties()).rejects.toThrow(
        "Server error"
      );
    });

    test("should handle network errors correctly", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(propertyAPI.getAllProperties()).rejects.toThrow(
        "Network error"
      );
    });
  });
});
