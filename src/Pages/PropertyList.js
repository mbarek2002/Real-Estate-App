import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../Components/PropertyCard";
import PropertyFilters from "../Components/PropertyFilters";
import { propertyAPI } from "../services/api";
import { useApp } from "../context/AppContext";

const PropertyList = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    amenities: [],
  });

  const { location } = useApp();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (location?.latitude && location?.longitude) {
          response = await propertyAPI.discoverProperties(
            location.latitude,
            location.longitude
          );
          const allProperties = [...response.nearby, ...response.recommended];
          setProperties(allProperties);
        } else {
          const allProperties = await propertyAPI.getAllProperties();
          setProperties(allProperties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location]);

  // Apply filters whenever properties or filters change
  useEffect(() => {
    let filtered = [...properties];

    // Filter by type (buy/rent)
    if (filters.type !== "all") {
      if (filters.type === "buy") {
        filtered = filtered.filter((p) => p.forSale);
      } else if (filters.type === "rent") {
        filtered = filtered.filter((p) => p.forRent);
      }
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter((p) => {
        const price = filters.type === "rent" ? p.rentPrice : p.salePrice;
        return price && price >= parseInt(filters.minPrice);
      });
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => {
        const price = filters.type === "rent" ? p.rentPrice : p.salePrice;
        return price && price <= parseInt(filters.maxPrice);
      });
    }

    // Filter by bedrooms (for residential properties)
    if (filters.bedrooms) {
      filtered = filtered.filter(
        (p) =>
          p.propertyType === "ResidentialProperty" &&
          p.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    // Filter by bathrooms (for residential properties)
    if (filters.bathrooms) {
      filtered = filtered.filter(
        (p) =>
          p.propertyType === "ResidentialProperty" &&
          p.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter((p) => {
        if (filters.propertyType === "ResidentialProperty") {
          return p.propertyType === "ResidentialProperty";
        }
        return p.propertyType === filters.propertyType;
      });
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.amenities.every((amenity) => p[amenity]);
      });
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      propertyType: "",
      amenities: [],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                Find Your Perfect{" "}
                <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  {filters.type === "all"
                    ? "Property"
                    : filters.type === "buy"
                    ? "Home"
                    : "Rental"}
                </span>
              </h1>
              <p className="text-xl text-gray-600">
                {filteredProperties.length} properties found
              </p>
            </div>

            {/* Quick Type Toggle */}
            <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => handleFilterChange({ type: "all" })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filters.type === "all"
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange({ type: "buy" })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filters.type === "buy"
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => handleFilterChange({ type: "rent" })}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filters.type === "rent"
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Rent
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card-elevated p-6 sticky top-24">
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:w-3/4">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No properties found
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more
                  properties.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
