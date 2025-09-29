import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn, MdMyLocation } from "react-icons/md";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleLocationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      property.address?.coordinates &&
      Array.isArray(property.address.coordinates) &&
      property.address.coordinates.length === 2
    ) {
      const [lng, lat] = property.address.coordinates;
      // Navigate to explore page with property coordinates
      navigate(`/explore?lat=${lat}&lng=${lng}&zoom=15`);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeDisplay = (property) => {
    if (property.propertyType === "ResidentialProperty") {
      return property.residentialType || "Residential";
    }
    return property.propertyType?.replace("Property", "") || "Property";
  };

  const getPrimaryPrice = () => {
    if (property.forSale && property.salePrice) {
      return { label: "Sale", value: formatPrice(property.salePrice) };
    }
    if (property.forRent && property.rentPrice) {
      return {
        label: `Rent/${property.rentDuration || "Monthly"}`,
        value: formatPrice(property.rentPrice),
      };
    }
    return { label: "", value: "Price on request" };
  };

  const getMainImage = () => {
    if (property.images && property.images.length > 0) {
      return `${process.env.REACT_APP_API_URL || "http://localhost:8080"}/${
        property.images[0]
      }`;
    }
    return "/placeholder-property.jpg";
  };

  const primaryPrice = getPrimaryPrice();

  return (
    <Link
      to={`/property/${property._id}`}
      className="card-elevated property-card group animate-fade-in block h-48 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
    >
      {/* Background Image */}
      <div className="relative w-full h-full">
        <img
          src={getMainImage()}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top Row - Price and Status */}
          <div className="flex items-start justify-between">
            {/* Price Badge */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
              <span className="text-sm font-bold text-gray-900">
                {primaryPrice.value}
              </span>
            </div>

            {/* Right side - Status and Location */}
            <div className="flex items-center gap-2">
              {/* Location Button */}
              {property.address?.coordinates &&
                Array.isArray(property.address.coordinates) &&
                property.address.coordinates.length === 2 && (
                  <button
                    onClick={handleLocationClick}
                    className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group"
                    title="Show on map"
                  >
                    <MdMyLocation className="h-4 w-4 text-primary-600 group-hover:text-primary-700" />
                  </button>
                )}

              {/* Status Badge */}
              <div
                className={`px-3 py-1 rounded-lg backdrop-blur-sm shadow-lg ${
                  property.status === "Available"
                    ? "bg-green-500/90 text-white"
                    : property.status === "Sold"
                    ? "bg-red-500/90 text-white"
                    : "bg-yellow-500/90 text-white"
                }`}
              >
                <span className="text-xs font-bold">{property.status}</span>
              </div>
            </div>
          </div>

          {/* Bottom Row - Property Info */}
          <div className="space-y-2">
            {/* Title and Type */}
            <div>
              <h3 className="text-white font-bold text-lg line-clamp-1 mb-1 drop-shadow-lg">
                {property.title}
              </h3>
              <p className="text-white/90 text-sm font-semibold drop-shadow-md">
                {getPropertyTypeDisplay(property)}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center text-white/90">
              <MdLocationOn className="h-4 w-4 mr-1 flex-shrink-0 drop-shadow-md" />
              <span className="text-sm truncate drop-shadow-md">
                {property.address?.address || "Location not specified"}
              </span>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-4 text-white/90">
              {property.bedrooms && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {property.bedrooms}
                  </span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10 3h4M3 7h18v4H3V7z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {property.bathrooms}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
