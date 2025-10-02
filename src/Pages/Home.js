import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero1 from "../Components/Hero1";
import PropertyCard from "../Components/PropertyCard";
import { propertyAPI } from "../services/api";
import { useApp } from "../context/AppContext";

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location, setProperties } = useApp();
  const navigate = useNavigate();

  // Quick search state
  const [search, setSearch] = useState({
    type: "all", // all | buy | rent
    propertyType: "", // ResidentialProperty | CommercialProperty | IndustrialProperty | LandProperty
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        let properties = [];

        if (location?.latitude && location?.longitude) {
          const response = await propertyAPI.discoverProperties(
            location.latitude,
            location.longitude
          );
          properties = [...response.nearby, ...response.recommended].slice(
            0,
            6
          );
        } else {
          const allProperties = await propertyAPI.getAllProperties();
          properties = allProperties.slice(0, 6);
        }

        setFeaturedProperties(properties);
        setProperties(properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location]);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2070&q=80"
            alt="Beautiful luxury home"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2070&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-transparent to-primary-600/50"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/15 rounded-full animate-float shadow-lg"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-lg animate-float shadow-lg"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-12 h-12 bg-white/12 rounded-full animate-float shadow-lg"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-24 h-24 bg-white/8 rounded-lg animate-float shadow-lg"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/25 to-primary-400/25 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            {/* Enhanced main heading with better typography */}
            <div className="mb-8">
              <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold mb-8 animate-slide-up shadow-lg border border-white/30">
                🏠 Find Your Dream Home Today
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight drop-shadow-2xl">
                Discover extraordinary places to live
              </h1>
              <p className="text-white/95 max-w-3xl mx-auto text-xl leading-relaxed mb-8 drop-shadow-lg">
                Explore curated listings, immersive 360° tours, and
                location-powered recommendations that help you find your perfect
                home.
              </p>
            </div>

            {/* Enhanced search bar with better design */}
            <div className="mt-12 bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 animate-slide-up hover:shadow-3xl transition-all duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Find Your Perfect Property
                </h3>
                <p className="text-gray-600">
                  Search from thousands of verified listings
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    className="form-input w-full"
                    value={search.type}
                    onChange={(e) =>
                      setSearch({ ...search, type: e.target.value })
                    }
                  >
                    <option value="all">Buy or Rent</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    className="form-input w-full"
                    value={search.propertyType}
                    onChange={(e) =>
                      setSearch({ ...search, propertyType: e.target.value })
                    }
                  >
                    <option value="">All Types</option>
                    <option value="ResidentialProperty">Residential</option>
                    <option value="CommercialProperty">Commercial</option>
                    <option value="IndustrialProperty">Industrial</option>
                    <option value="LandProperty">Land</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="$0"
                    className="form-input w-full"
                    value={search.minPrice}
                    onChange={(e) =>
                      setSearch({ ...search, minPrice: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="$1,000,000"
                    className="form-input w-full"
                    value={search.maxPrice}
                    onChange={(e) =>
                      setSearch({ ...search, maxPrice: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Any"
                    className="form-input w-full"
                    value={search.bedrooms}
                    onChange={(e) =>
                      setSearch({ ...search, bedrooms: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-end">
                  <button
                    className="btn-primary w-full text-base font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (search.type && search.type !== "all")
                        params.set("type", search.type);
                      if (search.propertyType)
                        params.set("propertyType", search.propertyType);
                      if (search.minPrice)
                        params.set("minPrice", search.minPrice);
                      if (search.maxPrice)
                        params.set("maxPrice", search.maxPrice);
                      if (search.bedrooms)
                        params.set("bedrooms", search.bedrooms);
                      navigate(`/explore?${params.toString()}`);
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Search Properties
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Property Showcase Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              🏡 Beautiful Homes
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Discover Stunning Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From modern apartments to luxury villas, find your perfect home in
              our curated collection
            </p>
          </div>

          {/* Property Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                title: "Modern Villa",
                location: "Beverly Hills, CA",
                price: "$2,500,000",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
                title: "Luxury Apartment",
                location: "Manhattan, NY",
                price: "$1,800,000",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
                title: "Family Home",
                location: "Austin, TX",
                price: "$850,000",
              },
            ].map((property, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2070&q=80";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{property.title}</h3>
                  <p className="text-white/90 mb-2">{property.location}</p>
                  <p className="text-2xl font-bold text-primary-300">
                    {property.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Strip */}
      <section className="bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            {[
              {
                label: "Verified Listings",
                value: "2k+",
                icon: "🏠",
                color: "from-blue-500 to-blue-600",
                description: "Premium properties",
                trend: "+15% this month",
              },
              {
                label: "360° Tours",
                value: "800+",
                icon: "📹",
                color: "from-purple-500 to-purple-600",
                description: "Virtual experiences",
                trend: "+25% this month",
              },
              {
                label: "Expert Agents",
                value: "120+",
                icon: "👥",
                color: "from-green-500 to-green-600",
                description: "Professional team",
                trend: "+8% this month",
              },
              {
                label: "Cities Covered",
                value: "40+",
                icon: "🌍",
                color: "from-orange-500 to-orange-600",
                description: "Nationwide reach",
                trend: "+3 new cities",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card-elevated text-center py-8 group hover:scale-105 transition-all duration-300 animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    {item.icon}
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">
                    {item.value}
                  </div>
                  <div className="text-gray-600 font-semibold mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {item.description}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    {item.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Properties Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              ✨ Featured Properties
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Discover Your Dream Home
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Handpicked premium properties with verified details and immersive
              virtual tours
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 rounded-2xl h-64 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {featuredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProperties.map((property, index) => (
                    <div
                      key={property._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
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
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Properties Available
                  </h3>
                  <p className="text-gray-500 text-lg">
                    We're working on adding more amazing properties. Check back
                    soon!
                  </p>
                </div>
              )}

              <div className="text-center mt-16">
                <Link
                  to="/explore"
                  className="btn-primary inline-flex items-center text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Explore All Properties
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              🚀 Why Choose Us
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Convergimmob
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of real estate with cutting-edge technology
              and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-fade-in card-elevated p-8 hover:shadow-xl transition-all duration-300">
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                360° Virtual Tours
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Explore properties with immersive 360° virtual tours from
                anywhere in the world.
              </p>
            </div>

            <div
              className="text-center group animate-fade-in card-elevated p-8 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Verified Properties
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                All properties are verified and authentic, ensuring quality and
                reliability for every transaction.
              </p>
            </div>

            <div
              className="text-center group animate-fade-in card-elevated p-8 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Location-Based Search
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Find properties near you with our smart location-based search
                powered by advanced algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Lifestyle Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              🌟 Lifestyle & Living
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Experience the Perfect Lifestyle
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover neighborhoods that match your lifestyle and find your
              dream home
            </p>
          </div>

          {/* Lifestyle Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                title: "Urban Living",
                description: "Modern city apartments",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                title: "Suburban Bliss",
                description: "Family-friendly neighborhoods",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
                title: "Luxury Living",
                description: "Premium properties",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                title: "Coastal Retreats",
                description: "Beachside properties",
              },
            ].map((lifestyle, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={lifestyle.image}
                    alt={lifestyle.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{lifestyle.title}</h3>
                  <p className="text-white/90 text-sm">
                    {lifestyle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6 animate-fade-in">
              💬 What Our Clients Say
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who found their perfect home with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Home Buyer",
                image:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                content:
                  "The 360° virtual tour feature was incredible! I could explore every corner of the house before even visiting. Found my dream home in just 2 weeks!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Real Estate Investor",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                content:
                  "The location-based search helped me find the perfect commercial property for my business. The verification process gave me complete confidence in my investment.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "First-time Buyer",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                content:
                  "As a first-time buyer, I was nervous about the process. The team guided me through everything and made it so easy. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="card-elevated p-8 text-center group hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Enhanced CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Beautiful Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Beautiful modern home exterior"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 via-primary-700/90 to-primary-800/90"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
          <div
            className="absolute top-20 right-20 w-12 h-12 bg-white/5 rounded-lg animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-20 h-20 bg-white/8 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-14 h-14 bg-white/6 rounded-lg animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* Gradient orbs */}
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-2xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-16 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl border border-white/20 animate-fade-in">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-6">
                🚀 Join Our Platform
              </div>
              <h3 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                Ready to list your property?
              </h3>
              <p className="text-white/90 text-xl leading-relaxed max-w-2xl mb-6">
                Join thousands of successful property owners and reach motivated
                buyers and renters with our advanced platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Free listing
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  360° virtual tours
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Expert support
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="/add-property"
                className="btn-outline bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50 text-lg px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  List Your Property
                </span>
              </Link>
              <Link
                to="/contact"
                className="text-white/80 hover:text-white text-center text-sm font-medium transition-colors duration-300"
              >
                Need help? Contact our team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
