import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdSearch } from "react-icons/md";

const Hero1 = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("buy");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    queryParams.set("type", searchType);
    if (location.trim()) {
      queryParams.set("location", location.trim());
    }
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Find Your Dream Home
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Discover amazing properties with 360° virtual tours. Buy, rent, or
          sell your perfect property.
        </p>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-lg shadow-xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Type */}
              <div className="md:col-span-1">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
              </div>

              {/* Location Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city, neighborhood, or address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <MdSearch className="h-5 w-5" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/properties?type=buy")}
              className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
            >
              Browse Properties
            </button>
            <button
              onClick={() => navigate("/add-property")}
              className="px-6 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
            >
              List Your Property
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
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
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero1;
