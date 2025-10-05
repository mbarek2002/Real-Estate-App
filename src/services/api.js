// API configuration and service functions
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Property API services
export const propertyAPI = {
  // Get all properties
  getAllProperties: () => apiRequest("/users/properties"),

  // Get property by ID
  getPropertyById: (id) => apiRequest(`/users/properties/${id}`),

  // Discover properties (with location)
  discoverProperties: (latitude, longitude) => {
    const params = new URLSearchParams();
    if (latitude) params.append("latitude", latitude);
    if (longitude) params.append("longitude", longitude);

    const queryString = params.toString();
    return apiRequest(
      `/users/properties/discover${queryString ? `?${queryString}` : ""}`
    );
  },

  // Record property view
  recordPropertyView: (propertyId, userId) =>
    apiRequest(`/users/properties/${propertyId}/view`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  // Add new property
  addProperty: (propertyData) => {
    const formData = new FormData();

    // Add all property fields to FormData
    Object.keys(propertyData).forEach((key) => {
      if (key === "images" || key === "images360") {
        // Handle file arrays
        if (propertyData[key]) {
          propertyData[key].forEach((file) => {
            formData.append(key, file);
          });
        }
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    return fetch(`${API_BASE_URL}/users/properties/`, {
      method: "POST",
      body: formData,
    });
  },

  // Update property
  updateProperty: (id, propertyData) => {
    const formData = new FormData();

    Object.keys(propertyData).forEach((key) => {
      if (key === "images" || key === "images360") {
        if (propertyData[key]) {
          propertyData[key].forEach((file) => {
            formData.append(key, file);
          });
        }
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    return fetch(`${API_BASE_URL}/users/properties/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  // Delete property
  deleteProperty: (id, userId) =>
    apiRequest(`/users/properties/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    }),
};

// Authentication API services
export const authAPI = {
  // User registration
  register: (userData) =>
    apiRequest("/users/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // User login
  login: (credentials) =>
    apiRequest("/users/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Get current user profile (using verifgmail endpoint)
  getProfile: (email) =>
    apiRequest("/users/auth/verifgmail", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Update user profile
  updateProfile: (userData) =>
    apiRequest("/users/user/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// News API services
export const newsAPI = {
  // Get all news
  getAllNews: () => apiRequest("/users/news"),

  // Get news by ID
  getNewsById: (id) => apiRequest(`/users/news/${id}`),
};

// Visit request API services
export const visitAPI = {
  // Request a visit
  requestVisit: (visitData) =>
    apiRequest("/users/visit", {
      method: "POST",
      body: JSON.stringify(visitData),
    }),

  // Get user's sent visit requests
  getSentVisits: (userId) => apiRequest(`/users/visit/sent/${userId}`),

  // Get user's received visit requests (for property owners)
  getReceivedVisits: (userId) => apiRequest(`/users/visit/received/${userId}`),

  // Update visit request status (approve/reject)
  updateVisitStatus: (visitId, status, ownerNotes = "") =>
    apiRequest(`/users/visit/${visitId}`, {
      method: "PUT",
      body: JSON.stringify({ status, ownerNotes }),
    }),

  // Delete visit request
  deleteVisitRequest: (visitId) =>
    apiRequest(`/users/visit/${visitId}`, {
      method: "DELETE",
    }),

  // Get visit request by ID
  getVisitById: (visitId) => apiRequest(`/users/visit/${visitId}`),
};

export default {
  propertyAPI,
  authAPI,
  newsAPI,
  visitAPI,
};
