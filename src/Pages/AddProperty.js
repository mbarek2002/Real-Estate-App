import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload, MdDelete, MdAdd } from "react-icons/md";
import { propertyAPI } from "../services/api";
import { useApp } from "../context/AppContext";

const AddProperty = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useApp();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "ResidentialProperty",
    area: "",
    forSale: false,
    salePrice: "",
    forRent: false,
    rentPrice: "",
    rentDuration: "Monthly",
    address: "",
    latitude: "",
    longitude: "",
    hasParking: false,
    hasSwimmingPool: false,
    hasGym: false,
    hasElevator: false,
    // Residential specific
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    floorNumber: "",
    totalFloors: "",
    residentialType: "Apartment",
    // Commercial specific
    officeSpace: "",
    meetingRooms: "",
    parkingSpaces: "",
    // Industrial specific
    storageCapacity: "",
    hasLoadingDock: false,
    // Land specific
    soilType: "",
    zoningType: "Residential",
  });

  const [images, setImages] = useState([]);
  const [images360, setImages360] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "images") {
      setImages((prev) => [...prev, ...files]);
    } else {
      setImages360((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index, type) => {
    if (type === "images") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages360((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.area ||
        (!formData.forSale && !formData.forRent)
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Add owner ID
      submitData.append("ownerId", user._id);

      // Add images
      images.forEach((file) => {
        submitData.append("images", file);
      });

      images360.forEach((file) => {
        submitData.append("images360", file);
      });

      // Submit property
      const response = await propertyAPI.addProperty(submitData);

      if (response.ok) {
        navigate("/");
      } else {
        throw new Error("Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      setError(error.message || "Failed to create property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyTypeFields = () => {
    switch (formData.propertyType) {
      case "ResidentialProperty":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Residential Type *
              </label>
              <select
                name="residentialType"
                value={formData.residentialType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Duplex">Duplex</option>
                <option value="Studio">Studio</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms *
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kitchens *
              </label>
              <input
                type="number"
                name="kitchens"
                value={formData.kitchens}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number *
              </label>
              <input
                type="number"
                name="floorNumber"
                value={formData.floorNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Floors *
              </label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
          </div>
        );

      case "CommercialProperty":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Space (sq ft) *
              </label>
              <input
                type="number"
                name="officeSpace"
                value={formData.officeSpace}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Rooms *
              </label>
              <input
                type="number"
                name="meetingRooms"
                value={formData.meetingRooms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parking Spaces *
              </label>
              <input
                type="number"
                name="parkingSpaces"
                value={formData.parkingSpaces}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="0"
              />
            </div>
          </div>
        );

      case "IndustrialProperty":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Capacity (sq ft) *
              </label>
              <input
                type="number"
                name="storageCapacity"
                value={formData.storageCapacity}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="hasLoadingDock"
                checked={formData.hasLoadingDock}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Has Loading Dock
              </label>
            </div>
          </div>
        );

      case "LandProperty":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soil Type *
              </label>
              <input
                type="text"
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="e.g., Clay, Sand, Loam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zoning Type *
              </label>
              <select
                name="zoningType"
                value={formData.zoningType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Property
            </h1>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Enter property title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your property..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type *
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="ResidentialProperty">Residential</option>
                      <option value="CommercialProperty">Commercial</option>
                      <option value="IndustrialProperty">Industrial</option>
                      <option value="LandProperty">Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq ft) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type Specific Fields */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Property Details
                </h3>
                {renderPropertyTypeFields()}
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pricing
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="forSale"
                      checked={formData.forSale}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      For Sale
                    </label>
                  </div>

                  {formData.forSale && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price *
                      </label>
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={formData.forSale}
                        min="1"
                        placeholder="Enter sale price"
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="forRent"
                      checked={formData.forRent}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      For Rent
                    </label>
                  </div>

                  {formData.forRent && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rent Price *
                        </label>
                        <input
                          type="number"
                          name="rentPrice"
                          value={formData.rentPrice}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={formData.forRent}
                          min="1"
                          placeholder="Enter rent price"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rent Duration *
                        </label>
                        <select
                          name="rentDuration"
                          value={formData.rentDuration}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={formData.forRent}
                        >
                          <option value="Daily">Daily</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter property address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 40.7128"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., -74.0060"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasParking"
                      checked={formData.hasParking}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Parking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasSwimmingPool"
                      checked={formData.hasSwimmingPool}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Swimming Pool
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasGym"
                      checked={formData.hasGym}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Gym
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasElevator"
                      checked={formData.hasElevator}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Elevator
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Images
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "images")}
                        className="hidden"
                        id="images-upload"
                      />
                      <label
                        htmlFor="images-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <MdCloudUpload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload images or drag and drop
                        </span>
                      </label>
                    </div>

                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, "images")}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <MdDelete className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      360° Images (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "images360")}
                        className="hidden"
                        id="images360-upload"
                      />
                      <label
                        htmlFor="images360-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <MdCloudUpload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload 360° images
                        </span>
                      </label>
                    </div>

                    {images360.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images360.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`360° Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, "images360")}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <MdDelete className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Property..." : "Create Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
