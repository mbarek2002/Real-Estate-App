import React, { useState, useEffect } from "react";
import {
  MdEmail,
  MdPhone,
  MdPerson,
  MdEdit,
  MdSave,
  MdCancel,
  MdPhotoCamera,
  MdHome,
  MdFavorite,
  MdVisibility,
  MdTrendingUp,
  MdCheckCircle,
  MdWarning,
  MdLocationOn,
  MdLogout,
  MdCalendarToday,
} from "react-icons/md";
import { useApp } from "../context/AppContext";
import { propertyAPI, authAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, setUser, logout } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const [myProperties, setMyProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalFavorites: 0,
    profileCompletion: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    loadProfileData();
  }, [isAuthenticated, navigate, user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const all = await propertyAPI.getAllProperties();
      const mine = all.filter(
        (p) => p.ownerId?._id === user?._id || p.ownerId === user?._id
      );
      setMyProperties(mine);

      // Calculate stats
      const totalViews = mine.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalFavorites = user?.favorites?.length || 0;
      const profileCompletion = calculateProfileCompletion();

      setStats({
        totalProperties: mine.length,
        totalViews,
        totalFavorites,
        profileCompletion,
      });

      // Load favorites if available
      if (user?.favorites) {
        setFavorites(user.favorites);
      }
    } catch (e) {
      console.error("Error loading profile data:", e);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    const fields = [
      "fullName",
      "email",
      "phone",
      "bio",
      "location",
      "profileImage",
    ];
    const completedFields = fields.filter((field) => {
      if (field === "profileImage") return profileImage;
      return user?.[field] && user[field].trim() !== "";
    });
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await authAPI.updateProfile(form);
      if (response.success) {
        setUser(response.user);
        setEditing(false);
        // Reload profile data to get updated stats
        await loadProfileData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      location: user?.location || "",
    });
    setEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card-elevated p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Image and Basic Info */}
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-3xl font-black shadow-lg overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.fullName?.charAt(0) || "U"
                  )}
                </div>
                {editing && (
                  <label className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                    <MdPhotoCamera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  {user?.fullName || "Your Profile"}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  {user?.bio || "Manage your account and listings"}
                </p>
                {user?.location && (
                  <div className="flex items-center text-gray-500">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setEditing(!editing)}
                className="btn-outline flex items-center gap-3 px-6 py-3 text-lg"
              >
                <MdEdit className="w-5 h-5" />
                {editing ? "Cancel" : "Edit Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="btn-outline flex items-center gap-3 px-6 py-3 text-lg text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <MdLogout className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Statistics and Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Completion */}
            <div className="card-elevated p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Profile Completion
              </h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-primary-600">
                    {stats.profileCompletion}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              {stats.profileCompletion < 100 && (
                <p className="text-sm text-gray-600">
                  Complete your profile to get better visibility
                </p>
              )}
            </div>

            {/* Statistics */}
            <div className="card-elevated p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center">
                    <MdHome className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Properties</div>
                      <div className="font-bold text-blue-600">
                        {stats.totalProperties}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center">
                    <MdVisibility className="h-6 w-6 mr-3 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Total Views</div>
                      <div className="font-bold text-green-600">
                        {stats.totalViews}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center">
                    <MdFavorite className="h-6 w-6 mr-3 text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-600">Favorites</div>
                      <div className="font-bold text-purple-600">
                        {stats.totalFavorites}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-elevated p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to="/visit-requests"
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all duration-300 group"
                >
                  <div className="p-2 bg-primary-600 text-white rounded-lg group-hover:bg-primary-700 transition-colors">
                    <MdCalendarToday className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Visit Requests
                    </div>
                    <div className="text-sm text-gray-600">
                      Manage property visits
                    </div>
                  </div>
                </Link>
                <Link
                  to="/add-property"
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
                >
                  <div className="p-2 bg-green-600 text-white rounded-lg group-hover:bg-green-700 transition-colors">
                    <MdHome className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Add Property
                    </div>
                    <div className="text-sm text-gray-600">
                      List a new property
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Overview */}
            <div className="card-elevated p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Account Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-xl">
                  <MdPerson className="h-6 w-6 mr-3 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div className="font-semibold">{user?.fullName || "-"}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-xl">
                  <MdEmail className="h-6 w-6 mr-3 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold">{user?.email || "-"}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-xl">
                  <MdPhone className="h-6 w-6 mr-3 text-primary-500" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-semibold">{user?.phone || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editable form */}
          <div className="card-elevated p-8 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    name="fullName"
                    className="form-input"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    name="phone"
                    className="form-input"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    name="location"
                    className="form-input"
                    value={form.location}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your location"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-input min-h-[100px] resize-none"
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {editing && (
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-outline flex items-center gap-2 px-6 py-3"
                  >
                    <MdCancel className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <MdSave className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="card-elevated p-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <MdFavorite className="text-red-500" />
                  Favorite Properties
                </h2>
                <p className="text-gray-600">
                  Properties you've saved for later
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {favorites.slice(0, 6).map((property) => (
                <div
                  key={property._id}
                  className="card-elevated p-4 group hover:scale-105 transition-all duration-300"
                >
                  <div className="flex gap-4">
                    <img
                      src={`${
                        process.env.REACT_APP_API_URL || "http://localhost:8080"
                      }/${property.images?.[0] || ""}`}
                      alt={property.title}
                      className="h-16 w-20 object-cover rounded-lg"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/80x64?text=No+Image")
                      }
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                        {property.address?.address || "-"}
                      </p>
                      <p className="text-lg font-bold text-primary-600">
                        {property.forSale && property.salePrice
                          ? `$${property.salePrice}`
                          : property.forRent && property.rentPrice
                          ? `$${property.rentPrice}/${property.rentDuration}`
                          : "Price on request"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link
                      to={`/property/${property._id}`}
                      className="btn-outline text-sm px-4 py-2 w-full text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {favorites.length > 6 && (
              <div className="text-center mt-6">
                <Link to="/favorites" className="btn-outline">
                  View All Favorites ({favorites.length})
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Manage Listings */}
        <div className="card-elevated p-8 mt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MdHome className="text-primary-600" />
                My Property Listings
              </h2>
              <p className="text-gray-600">
                Manage and track your property listings
              </p>
            </div>
            <Link to="/add-property" className="btn-primary px-8 py-4 text-lg">
              <span className="flex items-center gap-3">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Property
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : myProperties.length === 0 ? (
            <div className="text-center py-16">
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                No listings yet
              </h3>
              <p className="text-gray-600 mb-8">
                Start by adding your first property listing
              </p>
              <Link
                to="/add-property"
                className="btn-primary px-8 py-4 text-lg"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {myProperties.map((p) => (
                <div
                  key={p._id}
                  className="card-elevated p-6 group hover:scale-105 transition-all duration-300"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={`${
                          process.env.REACT_APP_API_URL ||
                          "http://localhost:8080"
                        }/${p.images?.[0] || ""}`}
                        alt={p.title}
                        className="h-20 w-28 object-cover rounded-xl"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/160x120?text=No+Image")
                        }
                      />
                      {/* Status Badge */}
                      <div className="absolute -top-2 -right-2">
                        {p.status === "sold" ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            Sold
                          </span>
                        ) : p.status === "rented" ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Rented
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 line-clamp-2 mb-2">
                        {p.title}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-1 mb-2">
                        {p.address?.address || "-"}
                      </div>
                      <div className="text-lg font-bold text-primary-600 mb-2">
                        {p.forSale && p.salePrice
                          ? `$${p.salePrice}`
                          : p.forRent && p.rentPrice
                          ? `$${p.rentPrice}/${p.rentDuration}`
                          : "Price on request"}
                      </div>
                      {/* Views and Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MdVisibility className="w-4 h-4" />
                          {p.views || 0} views
                        </div>
                        <div className="flex items-center gap-1">
                          <MdFavorite className="w-4 h-4" />
                          {p.favorites?.length || 0} saves
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/property/${p._id}`}
                      className="btn-outline text-sm px-4 py-2 flex-1 text-center"
                    >
                      View
                    </Link>
                    <Link
                      to={`/add-property?id=${p._id}`}
                      className="btn-primary text-sm px-4 py-2 flex-1 text-center"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn-outline text-sm px-4 py-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                      onClick={async () => {
                        if (!window.confirm("Delete this listing?")) return;
                        try {
                          await propertyAPI.deleteProperty(p._id, user?._id);
                          setMyProperties((prev) =>
                            prev.filter((x) => x._id !== p._id)
                          );
                        } catch (e) {
                          alert("Failed to delete. Try again.");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
