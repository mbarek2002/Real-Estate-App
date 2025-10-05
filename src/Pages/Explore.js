import React, { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useSearchParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropertyFilters from "../Components/PropertyFilters";
import PropertyCard from "../Components/PropertyCard";
import { propertyAPI } from "../services/api";
import { useApp } from "../context/AppContext";

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <button
        onClick={onZoomIn}
        className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
      <div className="h-px bg-gray-200"></div>
      <button
        onClick={onZoomOut}
        className="w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
      >
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
            d="M18 12H6"
          />
        </svg>
      </button>
    </div>
  );
};

const Explore = () => {
  const {
    location,
    filterPanelOpen,
    setFilterPanel,
    propertiesPanelOpen,
    setPropertiesPanel,
    setFilteredPropertiesCount,
  } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get URL parameters for map focus
  const urlLat = searchParams.get("lat");
  const urlLng = searchParams.get("lng");
  const urlZoom = searchParams.get("zoom");

  // Set initial map center and zoom based on URL parameters or default to France
  const mapCenter =
    urlLat && urlLng
      ? [parseFloat(urlLat), parseFloat(urlLng)]
      : [46.6034, 1.8883];
  const mapZoom = urlZoom ? parseInt(urlZoom) : 6;
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    amenities: [],
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const mapRef = useRef(null);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = {
      type: searchParams.get("type") || "all",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: "",
      propertyType: searchParams.get("propertyType") || "",
      amenities: [],
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Load properties
  useEffect(() => {
    const fetchProps = async () => {
      try {
        setLoading(true);
        setError(null);
        if (location?.latitude && location?.longitude) {
          const response = await propertyAPI.discoverProperties(
            location.latitude,
            location.longitude
          );
          const all = [...response.nearby, ...response.recommended];
          setProperties(all);
        } else {
          const all = await propertyAPI.getAllProperties();
          setProperties(all);
        }
      } catch (e) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [location]);

  // Center map on location change
  useEffect(() => {
    if (location?.latitude && location?.longitude && mapRef.current) {
      mapRef.current.setView(
        [location.latitude, location.longitude],
        13 // Zoom level
      );
      console.log("Map centered on:", {
        lat: location.latitude,
        lng: location.longitude,
      });
    }
  }, [location]);

  // Center map on URL parameter change (when clicking property location button)
  useEffect(() => {
    if (urlLat && urlLng && mapRef.current) {
      const lat = parseFloat(urlLat);
      const lng = parseFloat(urlLng);
      const zoom = urlZoom ? parseInt(urlZoom) : 15;

      mapRef.current.setView([lat, lng], zoom);
      console.log("Map centered on property from URL:", {
        lat,
        lng,
        zoom,
      });
    }
  }, [urlLat, urlLng, urlZoom]);

  // Apply filters
  useEffect(() => {
    try {
      let filtered = [...properties];

      // Debug logging
      console.log("Filtering properties:", {
        totalProperties: properties.length,
        filters: filters,
        currentFiltered: filtered.length,
      });

      // Log sample property data to understand structure
      if (properties.length > 0) {
        console.log("Sample property data:", {
          firstProperty: properties[0],
          hasForSale: properties[0]?.forSale,
          hasForRent: properties[0]?.forRent,
          propertyKeys: Object.keys(properties[0] || {}),
        });
      }

      // Filter by property type (buy/rent/all)
      if (filters.type !== "all") {
        console.log(
          `Applying ${filters.type} filter to ${filtered.length} properties`
        );

        if (filters.type === "buy") {
          const beforeCount = filtered.length;
          filtered = filtered.filter((p) => {
            const hasForSale = p && p.forSale === true;
            console.log(
              `Property ${p?.title}: forSale=${p?.forSale}, forRent=${p?.forRent}, matches=${hasForSale}`
            );
            return hasForSale;
          });
          console.log(`After buy filter: ${beforeCount} -> ${filtered.length}`);
        }
        if (filters.type === "rent") {
          const beforeCount = filtered.length;
          filtered = filtered.filter((p) => {
            const hasForRent = p && p.forRent === true;
            console.log(
              `Property ${p?.title}: forSale=${p?.forSale}, forRent=${p?.forRent}, matches=${hasForRent}`
            );
            return hasForRent;
          });
          console.log(
            `After rent filter: ${beforeCount} -> ${filtered.length}`
          );
        }
      }

      // Filter by minimum price
      if (filters.minPrice && filters.minPrice.trim() !== "") {
        const beforeCount = filtered.length;
        const minPriceValue = parseInt(filters.minPrice);
        if (!isNaN(minPriceValue)) {
          filtered = filtered.filter((p) => {
            if (!p) return false;

            if (filters.type === "rent") {
              return (
                p.rentPrice &&
                !isNaN(p.rentPrice) &&
                p.rentPrice >= minPriceValue
              );
            } else if (filters.type === "buy") {
              return (
                p.salePrice &&
                !isNaN(p.salePrice) &&
                p.salePrice >= minPriceValue
              );
            } else {
              // For "all" type, check if either price meets the minimum requirement
              const salePriceValid =
                p.salePrice &&
                !isNaN(p.salePrice) &&
                p.salePrice >= minPriceValue;
              const rentPriceValid =
                p.rentPrice &&
                !isNaN(p.rentPrice) &&
                p.rentPrice >= minPriceValue;
              return salePriceValid || rentPriceValid;
            }
          });
        }
        console.log(
          `After minPrice filter (${filters.minPrice}):`,
          beforeCount,
          "->",
          filtered.length
        );
      }

      // Filter by maximum price
      if (filters.maxPrice && filters.maxPrice.trim() !== "") {
        const beforeCount = filtered.length;
        const maxPriceValue = parseInt(filters.maxPrice);
        if (!isNaN(maxPriceValue)) {
          filtered = filtered.filter((p) => {
            if (!p) return false;

            if (filters.type === "rent") {
              return (
                p.rentPrice &&
                !isNaN(p.rentPrice) &&
                p.rentPrice <= maxPriceValue
              );
            } else if (filters.type === "buy") {
              return (
                p.salePrice &&
                !isNaN(p.salePrice) &&
                p.salePrice <= maxPriceValue
              );
            } else {
              // For "all" type, check if either price meets the maximum requirement
              const salePriceValid =
                p.salePrice &&
                !isNaN(p.salePrice) &&
                p.salePrice <= maxPriceValue;
              const rentPriceValid =
                p.rentPrice &&
                !isNaN(p.rentPrice) &&
                p.rentPrice <= maxPriceValue;
              return salePriceValid || rentPriceValid;
            }
          });
        }
        console.log(
          `After maxPrice filter (${filters.maxPrice}):`,
          beforeCount,
          "->",
          filtered.length
        );
      }

      // Debug: Log current filter values
      console.log("Current filter values:", {
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minPriceType: typeof filters.minPrice,
        maxPriceType: typeof filters.maxPrice,
        minPriceTrimmed: filters.minPrice?.trim(),
        maxPriceTrimmed: filters.maxPrice?.trim(),
      });

      if (filters.bedrooms) {
        filtered = filtered.filter(
          (p) =>
            p &&
            p.propertyType === "ResidentialProperty" &&
            p.bedrooms &&
            p.bedrooms >= parseInt(filters.bedrooms)
        );
      }
      if (filters.bathrooms) {
        filtered = filtered.filter(
          (p) =>
            p &&
            p.propertyType === "ResidentialProperty" &&
            p.bathrooms &&
            p.bathrooms >= parseInt(filters.bathrooms)
        );
      }
      if (filters.propertyType) {
        filtered = filtered.filter(
          (p) => p && p.propertyType === filters.propertyType
        );
      }
      if (filters.amenities.length > 0) {
        filtered = filtered.filter(
          (p) => p && filters.amenities.every((a) => p[a] === true)
        );
      }

      console.log("Final filtered count:", filtered.length);
      setFilteredProperties(filtered);
      setFilteredPropertiesCount(filtered.length);

      // Auto-open properties panel when there are filtered results, auto-close when no results
      // Only show properties container when filters are applied and there are results
      if (filtered.length > 0) {
        console.log("Opening properties panel - results found");
        setPropertiesPanel(true);
      } else {
        console.log("Closing properties panel - no results");
        setPropertiesPanel(false);
      }
    } catch (error) {
      console.error("Error filtering properties:", error);
      setFilteredProperties([]);
      setFilteredPropertiesCount(0);
      setPropertiesPanel(false);
    }
  }, [properties, filters]);

  // Ensure properties are shown when filter is "all" and properties are loaded
  useEffect(() => {
    if (
      properties.length > 0 &&
      filters.type === "all" &&
      filteredProperties.length === 0
    ) {
      console.log("Resetting filtered properties to show all properties");
      setFilteredProperties(properties);
      setFilteredPropertiesCount(properties.length);
      // Only open panel if there are actually properties to show
      if (properties.length > 0) {
        setPropertiesPanel(true);
      }
    }
  }, [properties, filters.type, filteredProperties.length]);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setShowCurrentLocation(true);

          // Center map on current location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your current location. Please check your browser permissions."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Reset to France view
  const resetToFrance = () => {
    setShowCurrentLocation(false);
    if (mapRef.current) {
      mapRef.current.setView([46.6034, 1.8883], 6);
    }
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Full Screen Map */}
      <div className="fixed inset-0">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredProperties
            .filter(
              (p) =>
                Array.isArray(p.address?.coordinates) &&
                p.address.coordinates.length === 2
            )
            .map((p) => {
              const [lng, lat] = p.address.coordinates;
              const price = p.forSale ? p.salePrice : p.rentPrice;
              const priceType = p.forSale ? "Sale" : "Rent";

              return (
                <Marker key={p._id} position={[lat, lng]}>
                  <Popup
                    className="custom-popup"
                    maxWidth={280}
                    style={{ zIndex: 1000 }}
                  >
                    <div className="w-64 p-0" style={{ zIndex: 1000 }}>
                      <div
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                        style={{ zIndex: 1000 }}
                      >
                        <div className="p-4">
                          {/* Status Badge */}
                          <div className="flex justify-end mb-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                p.status === "Available"
                                  ? "bg-green-500 text-white"
                                  : p.status === "Sold"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          {/* Property Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                            {p.title}
                          </h3>

                          {/* Price */}
                          {price && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl font-black text-primary-600">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(price)}
                              </span>
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                                {priceType}
                              </span>
                            </div>
                          )}

                          {/* Location */}
                          <div className="flex items-center text-gray-600 mb-3">
                            <svg
                              className="w-4 h-4 mr-1 text-primary-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs font-medium truncate">
                              {p.address?.address || "Location not specified"}
                            </span>
                          </div>

                          {/* Property Details */}
                          <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                            {p.bedrooms && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3 text-primary-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                <span className="font-medium">
                                  {p.bedrooms} beds
                                </span>
                              </div>
                            )}
                            {p.bathrooms && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3 text-primary-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-6a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {p.bathrooms} baths
                                </span>
                              </div>
                            )}
                            {p.area && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3 text-primary-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {p.area} sq ft
                                </span>
                              </div>
                            )}
                          </div>

                          {/* View Details Button */}
                          <button
                            onClick={() => navigate(`/property/${p._id}`)}
                            className="w-full bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg transform hover:scale-105"
                          >
                            <span className="flex items-center justify-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View Details
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {/* Floating Filter Panel - Left Side */}
      <div
        data-filter-panel
        className={`fixed top-32 left-4 sm:left-6 lg:left-8 bottom-4 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 ease-out z-20 flex flex-col ${
          filterPanelOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        {/* Filter Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={() => setFilterPanel(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <PropertyFilters
              filters={filters}
              onFilterChange={(newFilter) => {
                console.log("Filter change triggered:", newFilter);
                setFilters((prev) => {
                  const updated = { ...prev, ...newFilter };
                  console.log("Updated filters:", updated);
                  return updated;
                });
              }}
              onClearFilters={() =>
                setFilters({
                  type: "all",
                  minPrice: "",
                  maxPrice: "",
                  bedrooms: "",
                  bathrooms: "",
                  propertyType: "",
                  amenities: [],
                })
              }
            />
          </div>
        </div>

        {/* Results Summary - Fixed at Bottom */}
        <div className="p-6 border-t border-gray-100 flex-shrink-0">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-4 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-700">
                  Properties Found
                </p>
                <p className="text-2xl font-bold text-primary-800">
                  {filteredProperties.length}
                </p>
              </div>
              <div className="text-primary-600">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Results Container - Only show when filters return results and panel is open */}
      {filteredProperties &&
        filteredProperties.length > 0 &&
        propertiesPanelOpen && (
          <div
            className={`fixed top-32 right-4 sm:right-6 lg:right-8 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-50 transform transition-all duration-500 ease-out ${
              propertiesPanelOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-full flex flex-col">
              {/* Header with Results Count and Controls */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {filteredProperties.length} Properties Found
                    </h3>
                  </div>
                  <div className=" px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {filters.type === "buy"
                      ? "Sale"
                      : filters.type === "rent"
                      ? "Rent"
                      : "All"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterPanel(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                    title="Adjust Filters"
                  >
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
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                  {/* <button
                    onClick={() => setFilteredProperties([])}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                    title="Clear Results"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button> */}
                  <button
                    onClick={() => setPropertiesPanel(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                    title="Close Properties Panel"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Properties List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {filteredProperties.slice(0, 10).map((property, index) => (
                    <div
                      key={property._id}
                      className="transform hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>

                {filteredProperties.length > 10 && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Showing 10 of {filteredProperties.length} properties
                      <button className="ml-2 text-primary-600 hover:text-primary-700 font-medium">
                        View All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* No Results State - Only show when filters return no results but properties exist and panel is open */}
      {filteredProperties &&
        filteredProperties.length === 0 &&
        properties &&
        properties.length > 0 &&
        propertiesPanelOpen && (
          <div className="fixed top-32 right-4 sm:right-6 lg:right-8 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-50 transform transition-all duration-500 ease-out">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results
              </p>
              <button
                onClick={() => setFilterPanel(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
              >
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Adjust Filters
              </button>
            </div>
          </div>
        )}

      {/* Map Controls Overlay - Bottom */}
      <div className="fixed bottom-4 right-4 z-30 flex flex-row gap-3">
        {/* Location Button */}
        <button
          onClick={getCurrentLocation}
          className={`w-12 h-12 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex items-center justify-center transition-colors duration-200 ${
            showCurrentLocation
              ? "bg-primary-500 text-white hover:bg-primary-600"
              : "bg-white/95 text-gray-700 hover:bg-gray-50"
          }`}
          title={
            showCurrentLocation
              ? "Reset to France view"
              : "Show current location"
          }
        >
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* Reset to France Button (only show when current location is active) */}
        {showCurrentLocation && (
          <button
            onClick={resetToFrance}
            className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            title="Reset to France view"
          >
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        )}

        {/* Zoom Controls */}
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
    </div>
  );
};

export default Explore;
