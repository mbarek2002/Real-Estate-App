import React, { useState } from "react";
import {
  MdClose,
  MdCalendarToday,
  MdAccessTime,
  MdPerson,
  MdHome,
  MdNotes,
  MdCheckCircle,
} from "react-icons/md";
import { visitAPI } from "../services/api";

const ScheduleVisitModal = ({ isOpen, onClose, property, user }) => {
  const [formData, setFormData] = useState({
    visitDateTime: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    type: "sale", // sale, rent, both
    rentDuration: "",
    visitorNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.visitDateTime) {
      alert("Please select a date and time for your visit");
      return;
    }

    try {
      setLoading(true);
      const visitData = {
        propertyId: property._id,
        visitorId: user._id,
        ownerId: property.ownerId._id || property.ownerId,
        visitDateTime: formData.visitDateTime,
        timeZone: formData.timeZone,
        type: formData.type,
        rentDuration: formData.rentDuration || undefined,
        visitorNotes: formData.visitorNotes,
      };

      await visitAPI.requestVisit(visitData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          visitDateTime: "",
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          type: "sale",
          rentDuration: "",
          visitorNotes: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error scheduling visit:", error);
      alert("Failed to schedule visit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MdCalendarToday className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Schedule Visit
              </h2>
              <p className="text-gray-600">{property?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Visit Scheduled Successfully!
            </h3>
            <p className="text-gray-600">
              The property owner will be notified and will contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Visit Type */}
            <div>
              <label className="form-label flex items-center gap-2">
                <MdHome className="w-5 h-5 text-primary-600" />
                Visit Purpose
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="sale"
                    checked={formData.type === "sale"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.type === "sale"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300"
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">For Sale</div>
                    <div className="text-sm text-gray-600">
                      Interested in buying
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="rent"
                    checked={formData.type === "rent"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.type === "rent"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300"
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">For Rent</div>
                    <div className="text-sm text-gray-600">
                      Interested in renting
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="both"
                    checked={formData.type === "both"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.type === "both"
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300"
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Both</div>
                    <div className="text-sm text-gray-600">Sale or rent</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Rent Duration - Only show if rent or both is selected */}
            {(formData.type === "rent" || formData.type === "both") &&
              property?.forRent && (
                <div>
                  <label className="form-label">Rent Duration</label>
                  <select
                    name="rentDuration"
                    value={formData.rentDuration}
                    onChange={handleChange}
                    className="form-input"
                    required={
                      formData.type === "rent" || formData.type === "both"
                    }
                  >
                    <option value="">Select duration</option>
                    <option value="Daily">Daily</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label flex items-center gap-2">
                  <MdCalendarToday className="w-5 h-5 text-primary-600" />
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="visitDateTime"
                  value={formData.visitDateTime}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="form-input"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Select your preferred date and time for the visit
                </p>
              </div>

              <div>
                <label className="form-label flex items-center gap-2">
                  <MdAccessTime className="w-5 h-5 text-primary-600" />
                  Time Zone
                </label>
                <input
                  type="text"
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                  className="form-input"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  Automatically detected
                </p>
              </div>
            </div>

            {/* Visitor Notes */}
            <div>
              <label className="form-label flex items-center gap-2">
                <MdNotes className="w-5 h-5 text-primary-600" />
                Additional Notes
              </label>
              <textarea
                name="visitorNotes"
                value={formData.visitorNotes}
                onChange={handleChange}
                placeholder="Any specific questions or requests for the visit..."
                className="form-input min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            {/* Property Owner Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MdPerson className="w-5 h-5 text-primary-600" />
                Property Owner
              </h3>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Name:</strong> {property?.ownerId?.fullName || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {property?.ownerId?.email || "N/A"}
                </p>
                {property?.ownerId?.phone && (
                  <p>
                    <strong>Phone:</strong> {property.ownerId.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Scheduling...
                  </>
                ) : (
                  <>
                    <MdCalendarToday className="w-4 h-4" />
                    Schedule Visit
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleVisitModal;
