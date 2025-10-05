import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdCalendarToday,
  MdPerson,
  MdHome,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdAccessTime,
  MdNotes,
  MdDelete,
} from "react-icons/md";
import { visitAPI } from "../services/api";
import { useApp } from "../context/AppContext";

const VisitRequests = () => {
  const { user, isAuthenticated } = useApp();
  const [visitRequests, setVisitRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received"); // received, sent
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ownerNotes, setOwnerNotes] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      loadVisitRequests();
    }
  }, [isAuthenticated, user, activeTab]);

  const loadVisitRequests = async () => {
    try {
      setLoading(true);
      let requests;
      if (activeTab === "received") {
        requests = await visitAPI.getReceivedVisits(user._id);
      } else {
        requests = await visitAPI.getSentVisits(user._id);
      }
      setVisitRequests(requests);
    } catch (error) {
      console.error("Error loading visit requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await visitAPI.updateVisitStatus(requestId, status, ownerNotes);
      setShowModal(false);
      setSelectedRequest(null);
      setOwnerNotes("");
      loadVisitRequests();
    } catch (error) {
      console.error("Error updating visit status:", error);
      alert("Failed to update visit request. Please try again.");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (
      !window.confirm("Are you sure you want to delete this visit request?")
    ) {
      return;
    }

    try {
      await visitAPI.deleteVisitRequest(requestId);
      loadVisitRequests();
    } catch (error) {
      console.error("Error deleting visit request:", error);
      alert("Failed to delete visit request. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <MdCheckCircle className="w-5 h-5 text-green-600" />;
      case "Rejected":
        return <MdCancel className="w-5 h-5 text-red-600" />;
      default:
        return <MdPending className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view visit requests
          </h1>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Visit Requests
          </h1>
          <p className="text-gray-600">
            Manage your property visit requests and bookings
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("received")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "received"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Received Requests
              </button>
              <button
                onClick={() => setActiveTab("sent")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sent"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Requests
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : visitRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <MdCalendarToday className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              No visit requests yet
            </h3>
            <p className="text-gray-600 mb-8">
              {activeTab === "received"
                ? "You haven't received any visit requests for your properties"
                : "You haven't scheduled any property visits"}
            </p>
            {activeTab === "sent" && (
              <Link to="/properties" className="btn-primary">
                Browse Properties
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {visitRequests.map((request) => (
              <div
                key={request._id}
                className="card-elevated p-6 group hover:scale-105 transition-all duration-300"
              >
                {/* Property Info */}
                <div className="flex gap-4 mb-4">
                  <img
                    src={`${
                      process.env.REACT_APP_API_URL || "http://localhost:8080"
                    }/${request.propertyId?.images?.[0] || ""}`}
                    alt={request.propertyId?.title}
                    className="h-16 w-20 object-cover rounded-lg"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/80x64?text=No+Image")
                    }
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {request.propertyId?.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                      {request.propertyId?.address?.address}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visit Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MdAccessTime className="w-4 h-4" />
                    {formatDateTime(request.visitDateTime)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MdHome className="w-4 h-4" />
                    {request.type === "sale"
                      ? "For Sale"
                      : request.type === "rent"
                      ? "For Rent"
                      : "Sale or Rent"}
                    {request.rentDuration && ` (${request.rentDuration})`}
                  </div>
                  {activeTab === "received" && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MdPerson className="w-4 h-4" />
                      {request.visitorId?.fullName || "Unknown"}
                    </div>
                  )}
                  {activeTab === "sent" && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MdPerson className="w-4 h-4" />
                      {request.ownerId?.fullName || "Property Owner"}
                    </div>
                  )}
                </div>

                {/* Notes */}
                {request.visitorNotes && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <MdNotes className="w-4 h-4" />
                      Visitor Notes
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {request.visitorNotes}
                    </p>
                  </div>
                )}

                {/* Owner Notes */}
                {request.ownerNotes && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <MdNotes className="w-4 h-4" />
                      Owner Notes
                    </div>
                    <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      {request.ownerNotes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {activeTab === "received" && request.status === "Pending" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="btn-outline text-sm px-4 py-2 flex-1 text-center"
                      >
                        Respond
                      </button>
                    </>
                  )}
                  <Link
                    to={`/property/${request.propertyId?._id}`}
                    className="btn-outline text-sm px-4 py-2 flex-1 text-center"
                  >
                    View Property
                  </Link>
                  {activeTab === "sent" && (
                    <button
                      onClick={() => handleDeleteRequest(request._id)}
                      className="btn-outline text-sm px-4 py-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status Update Modal */}
        {showModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Respond to Visit Request
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedRequest.visitorId?.fullName} wants to visit{" "}
                {selectedRequest.propertyId?.title}
              </p>
              <div className="mb-4">
                <label className="form-label">Your Response</label>
                <textarea
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                  placeholder="Add any notes or instructions for the visitor..."
                  className="form-input min-h-[100px] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedRequest._id, "Rejected")
                  }
                  className="btn-outline flex-1 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  Reject
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedRequest._id, "Approved")
                  }
                  className="btn-primary flex-1"
                >
                  Approve
                </button>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setOwnerNotes("");
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <MdCancel className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitRequests;
