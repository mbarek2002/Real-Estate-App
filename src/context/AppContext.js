import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  properties: [],
  currentProperty: null,
  location: null,
  error: null,
  filterPanelOpen: false,
  propertiesPanelOpen: false,
  filteredPropertiesCount: 0,
};

// Action types
const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_PROPERTIES: "SET_PROPERTIES",
  SET_CURRENT_PROPERTY: "SET_CURRENT_PROPERTY",
  SET_LOCATION: "SET_LOCATION",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  TOGGLE_FILTER_PANEL: "TOGGLE_FILTER_PANEL",
  SET_FILTER_PANEL: "SET_FILTER_PANEL",
  TOGGLE_PROPERTIES_PANEL: "TOGGLE_PROPERTIES_PANEL",
  SET_PROPERTIES_PANEL: "SET_PROPERTIES_PANEL",
  SET_FILTERED_PROPERTIES_COUNT: "SET_FILTERED_PROPERTIES_COUNT",
  LOGOUT: "LOGOUT",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };

    case ActionTypes.SET_PROPERTIES:
      return { ...state, properties: action.payload };

    case ActionTypes.SET_CURRENT_PROPERTY:
      return { ...state, currentProperty: action.payload };

    case ActionTypes.SET_LOCATION:
      return { ...state, location: action.payload };

    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };

    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };

    case ActionTypes.TOGGLE_FILTER_PANEL:
      return { ...state, filterPanelOpen: !state.filterPanelOpen };

    case ActionTypes.SET_FILTER_PANEL:
      return { ...state, filterPanelOpen: action.payload };

    case ActionTypes.TOGGLE_PROPERTIES_PANEL:
      return { ...state, propertiesPanelOpen: !state.propertiesPanelOpen };

    case ActionTypes.SET_PROPERTIES_PANEL:
      return { ...state, propertiesPanelOpen: action.payload };

    case ActionTypes.SET_FILTERED_PROPERTIES_COUNT:
      return { ...state, filteredPropertiesCount: action.payload };

    case ActionTypes.LOGOUT:
      localStorage.removeItem("userEmail");
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentProperty: null,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing user on app load
  useEffect(() => {
    const checkAuth = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        try {
          const response = await authAPI.getProfile(userEmail);
          dispatch({ type: ActionTypes.SET_USER, payload: response.user });
        } catch (error) {
          localStorage.removeItem("userEmail");
          dispatch({ type: ActionTypes.SET_ERROR, payload: "Session expired" });
        }
      }
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    };

    checkAuth();
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch({
            type: ActionTypes.SET_LOCATION,
            payload: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  // Context value
  const value = {
    ...state,
    dispatch,
    // Helper functions
    login: async (credentials) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await authAPI.login(credentials);
        localStorage.setItem("userEmail", credentials.email);
        dispatch({ type: ActionTypes.SET_USER, payload: response.user });
        dispatch({ type: ActionTypes.CLEAR_ERROR });
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    },

    register: async (userData) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await authAPI.register(userData);
        localStorage.setItem("userEmail", userData.email);
        dispatch({ type: ActionTypes.SET_USER, payload: response.user });
        dispatch({ type: ActionTypes.CLEAR_ERROR });
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    },

    logout: () => {
      dispatch({ type: ActionTypes.LOGOUT });
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    setProperties: (properties) => {
      dispatch({ type: ActionTypes.SET_PROPERTIES, payload: properties });
    },

    setCurrentProperty: (property) => {
      dispatch({ type: ActionTypes.SET_CURRENT_PROPERTY, payload: property });
    },

    toggleFilterPanel: () => {
      dispatch({ type: ActionTypes.TOGGLE_FILTER_PANEL });
    },

    setFilterPanel: (isOpen) => {
      dispatch({ type: ActionTypes.SET_FILTER_PANEL, payload: isOpen });
    },

    togglePropertiesPanel: () => {
      dispatch({ type: ActionTypes.TOGGLE_PROPERTIES_PANEL });
    },

    setPropertiesPanel: (isOpen) => {
      dispatch({ type: ActionTypes.SET_PROPERTIES_PANEL, payload: isOpen });
    },

    setFilteredPropertiesCount: (count) => {
      dispatch({
        type: ActionTypes.SET_FILTERED_PROPERTIES_COUNT,
        payload: count,
      });
    },

    setLocation: (location) => {
      dispatch({ type: ActionTypes.SET_LOCATION, payload: location });
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
