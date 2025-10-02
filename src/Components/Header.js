import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  MdClose,
  MdMenu,
  MdPerson,
  MdSearch,
  MdLocationOn,
  MdFilterList,
  MdList,
} from "react-icons/md";
import { FaOpencart } from "react-icons/fa";
import logo from "../assets/logos/logo.svg";
import { useApp } from "../context/AppContext";

//import images svg
import Navbar from "./NavBar";

const Header = () => {
  const [menuOpened, setmenuOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuccess, setSearchSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    setLocation,
    toggleFilterPanel,
    togglePropertiesPanel,
    filteredPropertiesCount,
  } = useApp();

  const toggleMenu = () => setmenuOpened(!menuOpened);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Check if we're on the explore page
  const isExplorePage = location.pathname === "/explore";

  // Debounced search for suggestions
  useEffect(() => {
    if (!locationSearch.trim() || locationSearch.length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationSearch
          )}&limit=5&addressdetails=1`
        );

        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Search suggestions error:", error);
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationSearch]);

  // Handle location search
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationSearch.trim()) return;

    setIsSearching(true);
    try {
      // Use Nominatim (OpenStreetMap) free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationSearch
        )}&limit=1&addressdetails=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setLocation({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
          console.log("Location updated:", {
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          });

          // Clear the search input and show success
          setLocationSearch("");
          setSearchSuccess(true);
          setTimeout(() => setSearchSuccess(false), 3000); // Hide success message after 3 seconds
        } else {
          alert("Location not found. Please try a different address.");
        }
      } else {
        throw new Error("Geocoding service unavailable");
      }
    } catch (error) {
      console.error("Location search error:", error);
      alert(
        "Unable to find the specified location. Please try a different address or use the current location button."
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const { lat, lon, display_name } = suggestion;
    setLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
    setLocationSearch(""); // Clear the search input after selection
    setShowSuggestions(false);
    setSearchSuggestions([]); // Clear suggestions
    console.log("Location updated from suggestion:", {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      address: display_name,
    });
    // Show success message
    setSearchSuccess(true);
    setTimeout(() => setSearchSuccess(false), 3000);

    // Optionally navigate to explore page with coordinates
    if (location.pathname !== "/explore") {
      navigate(`/explore?lat=${lat}&lng=${lon}&zoom=12`);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur (with delay to allow suggestion clicks)
  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFilterClick = () => {
    // Toggle filter panel visibility
    toggleFilterPanel();
  };

  const handlePropertiesClick = () => {
    // Toggle properties panel visibility
    togglePropertiesPanel();
  };

  // Handle current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log("Current location set:", { latitude, longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your current location. Please try searching for an address instead."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 px-6 py-3 hover:shadow-2xl hover:bg-white/20 transition-all duration-500 group">
          <div className="flex items-center justify-between w-full">
            {/* Left Section - Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 mr-3 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                  <img
                    src={logo}
                    alt="Convergimmob Logo"
                    className="w-6 h-6 md:w-7 md:h-7 object-contain filter brightness-0 invert relative z-10"
                  />
                </div>
                <div className="text-gray-900 text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:via-primary-800 group-hover:to-primary-900 transition-all duration-300 tracking-tight">
                  Convergimmob
                </div>
              </Link>
            </div>

            {/* Center Section - Location Search (Explore Page) or Navigation (Other Pages) */}
            {isExplorePage ? (
              <div className="flex-1 max-w-md mx-4">
                <form onSubmit={handleLocationSearch} className="relative">
                  <div className="relative flex items-center">
                    <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search location by address..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full pl-10 pr-48 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      disabled={isSearching}
                    />

                    {/* Properties Button */}
                    <button
                      type="button"
                      onClick={handlePropertiesClick}
                      className="absolute right-28 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
                      title="Show properties"
                    >
                      <MdList className="h-4 w-4" />
                      {filteredPropertiesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-10">
                          {filteredPropertiesCount > 99
                            ? "99+"
                            : filteredPropertiesCount}
                        </span>
                      )}
                    </button>

                    {/* Filter Button */}
                    <button
                      type="button"
                      onClick={handleFilterClick}
                      className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
                      title="Open filters"
                    >
                      <MdFilterList className="h-4 w-4" />
                    </button>

                    {/* Current Location Button */}
                    <button
                      type="button"
                      onClick={handleCurrentLocation}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
                      title="Use current location"
                    >
                      <MdLocationOn className="h-4 w-4" />
                    </button>

                    {/* Search Button */}
                    <button
                      type="submit"
                      disabled={isSearching || !locationSearch.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                    >
                      {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <MdSearch className="h-4 w-4" />
                      )}
                    </button>

                    {/* Success Message */}
                    {searchSuccess && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          Location updated successfully!
                        </span>
                      </div>
                    )}

                    {/* Search Suggestions Dropdown */}
                    {showSuggestions &&
                      searchSuggestions.length > 0 &&
                      !searchSuccess && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <MdLocationOn className="h-4 w-4 text-primary-500 flex-shrink-0" />
                                <div className="truncate">
                                  <div className="font-medium">
                                    {suggestion.display_name.split(",")[0]}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {suggestion.display_name
                                      .split(",")
                                      .slice(1)
                                      .join(",")
                                      .trim()}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <Navbar containerStyles={"flex items-center gap-x-1"} />
              </div>
            )}

            {/* Right Section - User Actions */}
            <div className="flex items-center gap-x-2">
              {/* Mobile Menu Button */}
              {!menuOpened ? (
                <div
                  className={`md:hidden ${
                    isAnimating ? "animate-spin360" : ""
                  } transform origin-center mr-2`}
                  onClick={handleClick}
                >
                  <MdMenu
                    className="spin360 cursor-pointer hover:text-secondary p-1 text-btnColor h-6 w-6"
                    onClick={toggleMenu}
                  />
                </div>
              ) : (
                <div
                  className={`md:hidden ${
                    isAnimating ? "animate-spin360" : ""
                  } mr-2`}
                  onClick={handleClick}
                >
                  <MdClose
                    className="spin360 cursor-pointer hover:text-secondary p-1 text-btnColor h-6 w-6 rounded-full"
                    onClick={toggleMenu}
                  />
                </div>
              )}

              {/* User Actions */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-x-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50/80 rounded-lg transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                    <MdPerson className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user?.fullName || "Profile"}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-x-2">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-gray-700 hover:text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50/80 transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm px-5 py-2 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`${
              menuOpened
                ? "flex items-start flex-col gap-y-4 fixed top-20 right-4 p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-64 border border-white/20 transition-all duration-500 ease-out z-50"
                : "flex items-start flex-col gap-y-4 fixed top-20 p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-64 border border-white/20 transition-all duration-500 ease-in -right-[100%] z-50"
            }`}
          >
            {/* Mobile Location Search (Explore Page) */}
            {isExplorePage && (
              <div className="w-full mb-4">
                <form onSubmit={handleLocationSearch} className="relative">
                  <div className="relative flex items-center">
                    <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search location..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full pl-10 pr-48 py-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      disabled={isSearching}
                    />

                    {/* Properties Button */}
                    <button
                      type="button"
                      onClick={handlePropertiesClick}
                      className="absolute right-28 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
                      title="Show properties"
                    >
                      <MdList className="h-4 w-4" />
                      {filteredPropertiesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-10">
                          {filteredPropertiesCount > 99
                            ? "99+"
                            : filteredPropertiesCount}
                        </span>
                      )}
                    </button>

                    {/* Filter Button */}
                    <button
                      type="button"
                      onClick={handleFilterClick}
                      className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
                      title="Open filters"
                    >
                      <MdFilterList className="h-4 w-4" />
                    </button>

                    {/* Current Location Button */}
                    <button
                      type="button"
                      onClick={handleCurrentLocation}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 rounded-lg transition-all duration-300 hover:scale-105"
                      title="Use current location"
                    >
                      <MdLocationOn className="h-4 w-4" />
                    </button>

                    {/* Search Button */}
                    <button
                      type="submit"
                      disabled={isSearching || !locationSearch.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                    >
                      {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <MdSearch className="h-4 w-4" />
                      )}
                    </button>

                    {/* Mobile Success Message */}
                    {searchSuccess && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-green-500 text-white px-3 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-xs font-medium">
                          Location updated!
                        </span>
                      </div>
                    )}

                    {/* Mobile Search Suggestions Dropdown */}
                    {showSuggestions &&
                      searchSuggestions.length > 0 &&
                      !searchSuccess && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <MdLocationOn className="h-4 w-4 text-primary-500 flex-shrink-0" />
                                <div className="truncate">
                                  <div className="font-medium text-xs">
                                    {suggestion.display_name.split(",")[0]}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {suggestion.display_name
                                      .split(",")
                                      .slice(1, 3)
                                      .join(",")
                                      .trim()}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </form>
              </div>
            )}

            {/* Mobile Navigation */}
            <Navbar containerStyles="flex flex-col gap-y-2 w-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
