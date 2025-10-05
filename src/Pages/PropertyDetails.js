import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdBed,
  MdBathroom,
  MdSquareFoot,
  MdPhone,
  MdEmail,
  MdShare,
  MdFavorite,
  MdFavoriteBorder,
  MdDirections,
  MdMap,
} from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { propertyAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import ImageGallery from "../Components/ImageGallery";
import ScheduleVisitModal from "../Components/ScheduleVisitModal";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApp();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const propertyData = await propertyAPI.getPropertyById(id);
        setProperty(propertyData);

        // Record property view if user is authenticated
        if (isAuthenticated && user?._id) {
          try {
            await propertyAPI.recordPropertyView(id, user._id);
          } catch (error) {
            console.log("Could not record view:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Property not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAuthenticated, user]);

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm);
    // You can implement the actual contact form submission here
    setShowContactForm(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Map component for property location
  const PropertyMap = ({ property }) => {
    if (!property?.address?.coordinates) {
      return (
        <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <MdMap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Location not available</p>
          </div>
        </div>
      );
    }

    // Ensure coordinates are in the correct format [lat, lng]
    const coordinates = property.address.coordinates;
    const [lng, lat] = coordinates; // Note: coordinates might be [lng, lat] format

    // Debug logging
    console.log("Property coordinates:", coordinates);
    console.log("Using lat:", lat, "lng:", lng);

    // Validate coordinates
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return (
        <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <MdMap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Invalid coordinates</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-96 rounded-2xl overflow-hidden shadow-xl">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[lat, lng]}
            eventHandlers={{
              add: (e) => {
                console.log("Marker added at:", [lat, lng]);
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{property.title}</h3>
                <p className="text-gray-600">{property.address?.address}</p>
                <div className="mt-2">
                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                      window.open(url, "_blank");
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
                  >
                    <MdDirections className="h-4 w-4" />
                    Get Directions
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The property you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate("/properties")}
            className="btn-primary px-8 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-primary-600 transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-primary-50"
              >
                Home
              </button>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <button
                onClick={() => navigate("/properties")}
                className="text-gray-500 hover:text-primary-600 transition-colors duration-300 px-3 py-1 rounded-lg hover:bg-primary-50"
              >
                Properties
              </button>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-semibold px-3 py-1 bg-primary-50 rounded-lg">
              {property.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
              <ImageGallery images={property.images} />
            </div>

            {/* Property Info */}
            <div className="card-elevated p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    {property.title}
                  </h1>
                  <div className="flex items-center justify-between text-gray-600 mb-4">
                    <div className="flex items-center flex-1">
                      <MdLocationOn className="h-5 w-5 mr-2 text-primary-500" />
                      <span className="text-lg">
                        {property.address?.address || "Location not specified"}
                      </span>
                    </div>
                    {property.address?.coordinates &&
                      Array.isArray(property.address.coordinates) &&
                      property.address.coordinates.length === 2 && (
                        <button
                          onClick={() => {
                            const [lng, lat] = property.address.coordinates;
                            navigate(`/explore?lat=${lat}&lng=${lng}&zoom=15`);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 hover:scale-105 shadow-md"
                          title="View on map"
                        >
                          <MdMap className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            View on Map
                          </span>
                        </button>
                      )}
                  </div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary-100 text-primary-700 border border-primary-200">
                      {getPropertyTypeDisplay(property)}
                    </span>
                    <span
                      className={`px-4 py-2 text-sm font-semibold rounded-xl ${
                        property.status === "Available"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleShare}
                    className="p-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
                  >
                    <MdShare className="h-6 w-6" />
                  </button>
                  {isAuthenticated && (
                    <button
                      onClick={() => setIsFavorited(!isFavorited)}
                      className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                      {isFavorited ? (
                        <MdFavorite className="h-6 w-6 text-red-600" />
                      ) : (
                        <MdFavoriteBorder className="h-6 w-6" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Key Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
                  <MdSquareFoot className="h-8 w-8 mx-auto text-primary-600 mb-3" />
                  <div className="text-sm text-gray-600 font-medium">Area</div>
                  <div className="text-xl font-bold text-gray-900">
                    {property.area} sq ft
                  </div>
                </div>
                {property.propertyType === "ResidentialProperty" && (
                  <>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <MdBed className="h-8 w-8 mx-auto text-blue-600 mb-3" />
                      <div className="text-sm text-gray-600 font-medium">
                        Bedrooms
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {property.bedrooms}
                      </div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                      <MdBathroom className="h-8 w-8 mx-auto text-green-600 mb-3" />
                      <div className="text-sm text-gray-600 font-medium">
                        Bathrooms
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {property.bathrooms}
                      </div>
                    </div>
                  </>
                )}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                  <FaEye className="h-8 w-8 mx-auto text-purple-600 mb-3" />
                  <div className="text-sm text-gray-600 font-medium">Views</div>
                  <div className="text-xl font-bold text-gray-900">
                    {property.nbViews || 0}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gray-100 mb-6" />

              {/* Amenities */}
              {(property.hasParking ||
                property.hasSwimmingPool ||
                property.hasGym ||
                property.hasElevator) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.hasParking && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Parking
                      </span>
                    )}
                    {property.hasSwimmingPool && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Swimming Pool
                      </span>
                    )}
                    {property.hasGym && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Gym
                      </span>
                    )}
                    {property.hasElevator && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Elevator
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Highlights (derived) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Highlights
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Verified owner details</li>
                  <li>Well-connected neighborhood</li>
                  <li>Flexible viewing schedule</li>
                </ul>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description ||
                    "No description available for this property."}
                </p>
              </div>
            </div>

            {/* Location & Map Section */}
            <div className="card-elevated p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <MdLocationOn className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Location</h3>
                  <p className="text-gray-600">
                    Property location and nearby areas
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MdLocationOn className="h-5 w-5 text-primary-500" />
                  <span className="text-lg font-medium">
                    {property.address?.address || "Location not specified"}
                  </span>
                </div>

                {property.address?.coordinates && (
                  <button
                    onClick={() => {
                      const coordinates = property.address.coordinates;
                      const [lng, lat] = coordinates; // Ensure correct format
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                      window.open(url, "_blank");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    <MdDirections className="h-5 w-5" />
                    Get Directions
                  </button>
                )}
              </div>

              {/* Map */}
              <PropertyMap property={property} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price & Actions (Sticky) */}
            <div className="card-elevated p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing</h3>
              <div className="mb-6 space-y-3">
                {property.forSale && property.salePrice && (
                  <div className="text-3xl font-black text-green-600">
                    {formatPrice(property.salePrice)}
                    <span className="ml-3 text-sm text-gray-600 font-medium">
                      Sale
                    </span>
                  </div>
                )}
                {property.forRent && property.rentPrice && (
                  <div className="text-3xl font-black text-primary-600">
                    {formatPrice(property.rentPrice)}
                    <span className="ml-3 text-sm text-gray-600 font-medium">
                      / {property.rentDuration}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full btn-primary mb-4 text-lg py-4"
              >
                Contact Agent
              </button>
              <button
                onClick={() => setShowVisitModal(true)}
                className="w-full btn-outline text-lg py-4"
              >
                Schedule Visit
              </button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Agent
              </h3>

              {property.ownerId && (
                <div className="mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                      {property.ownerId.fullName?.charAt(0) || "A"}
                    </div>
                    <div className="font-medium text-gray-900">
                      {property.ownerId.fullName}
                    </div>
                  </div>
                  {property.ownerId.phone && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MdPhone className="h-4 w-4 mr-2" />
                      <span>{property.ownerId.phone}</span>
                    </div>
                  )}
                  {property.ownerId.email && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MdEmail className="h-4 w-4 mr-2" />
                      <span>{property.ownerId.email}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-3"
              >
                Send Message
              </button>

              <button
                onClick={() => setShowVisitModal(true)}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Schedule Visit
              </button>
            </div>

            {/* Property Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">
                    {getPropertyTypeDisplay(property)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${
                      property.status === "Available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Listed</span>
                  <span className="font-medium">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowContactForm(false);
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Send Message
                </h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="I'm interested in this property..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Visit Modal */}
      {isAuthenticated && (
        <ScheduleVisitModal
          isOpen={showVisitModal}
          onClose={() => setShowVisitModal(false)}
          property={property}
          user={user}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
