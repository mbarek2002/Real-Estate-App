import React from "react";
import { MdFilterList, MdClear } from "react-icons/md";

const PropertyFilters = ({ filters, onFilterChange, onClearFilters }) => {
  // Ensure filters has default values
  const safeFilters = {
    type: filters?.type || "all",
    minPrice: filters?.minPrice || "",
    maxPrice: filters?.maxPrice || "",
    bedrooms: filters?.bedrooms || "",
    bathrooms: filters?.bathrooms || "",
    propertyType: filters?.propertyType || "",
    amenities: filters?.amenities || [],
  };

  // Helper function to format price for display
  const formatPrice = (price) => {
    if (!price || price.trim() === "") return "";
    const numPrice = parseInt(price);
    return isNaN(numPrice) ? price : numPrice.toLocaleString();
  };

  const handleAmenityChange = (amenity) => {
    const currentAmenities = safeFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];

    onFilterChange({ amenities: newAmenities });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <MdFilterList className="h-6 w-6 text-primary-500" />
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-primary-50 transition-all duration-300"
        >
          <MdClear className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        {/* Property Type */}
        <div>
          <label className="form-label">Property Type</label>
          <select
            value={safeFilters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="form-input"
          >
            <option value="all">All</option>
            <option value="buy">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>

        {/* Property Category */}
        <div>
          <label className="form-label">Category</label>
          <select
            value={safeFilters.propertyType}
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
            className="form-input"
          >
            <option value="">All Categories</option>
            <option value="ResidentialProperty">Residential</option>
            <option value="CommercialProperty">Commercial</option>
            <option value="IndustrialProperty">Industrial</option>
            <option value="LandProperty">Land</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="form-label">Price Range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min Price"
              value={safeFilters.minPrice}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Min price changed:", value);
                // Only allow positive numbers or empty string
                if (value === "" || (!isNaN(value) && parseInt(value) >= 0)) {
                  onFilterChange({ minPrice: value });
                }
              }}
              className="form-input"
              min="0"
              step="1000"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={safeFilters.maxPrice}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Max price changed:", value);
                // Only allow positive numbers or empty string
                if (value === "" || (!isNaN(value) && parseInt(value) >= 0)) {
                  onFilterChange({ maxPrice: value });
                }
              }}
              className="form-input"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Bedrooms (for residential properties) */}
        {safeFilters.propertyType === "ResidentialProperty" && (
          <div>
            <label className="form-label">Bedrooms</label>
            <select
              value={safeFilters.bedrooms}
              onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
              className="form-input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        )}

        {/* Bathrooms (for residential properties) */}
        {safeFilters.propertyType === "ResidentialProperty" && (
          <div>
            <label className="form-label">Bathrooms</label>
            <select
              value={safeFilters.bathrooms}
              onChange={(e) => onFilterChange({ bathrooms: e.target.value })}
              className="form-input"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
        )}

        {/* Amenities */}
        <div>
          <label className="form-label">Amenities</label>
          <div className="space-y-3">
            {[
              { key: "hasParking", label: "Parking" },
              { key: "hasSwimmingPool", label: "Swimming Pool" },
              { key: "hasGym", label: "Gym" },
              { key: "hasElevator", label: "Elevator" },
            ].map((amenity) => (
              <label
                key={amenity.key}
                className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={safeFilters.amenities.includes(amenity.key)}
                  onChange={() => handleAmenityChange(amenity.key)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {amenity.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {Object.values(safeFilters).some((value) =>
          Array.isArray(value)
            ? value.length > 0
            : value && value !== "all" && value !== ""
        ) && (
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              Active Filters:
            </h4>
            <div className="flex flex-wrap gap-2">
              {safeFilters.type !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-primary-100 text-primary-700 border border-primary-200">
                  {safeFilters.type}
                </span>
              )}
              {safeFilters.propertyType && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                  {safeFilters.propertyType.replace("Property", "")}
                </span>
              )}
              {safeFilters.minPrice && safeFilters.minPrice.trim() !== "" && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  ${formatPrice(safeFilters.minPrice)}+
                </span>
              )}
              {safeFilters.maxPrice && safeFilters.maxPrice.trim() !== "" && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  ${formatPrice(safeFilters.maxPrice)}-
                </span>
              )}
              {safeFilters.bedrooms && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">
                  {safeFilters.bedrooms}+ beds
                </span>
              )}
              {safeFilters.bathrooms && (
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200">
                  {safeFilters.bathrooms}+ baths
                </span>
              )}
              {safeFilters.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                >
                  {amenity
                    .replace("has", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
