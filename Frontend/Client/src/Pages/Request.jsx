import { useEffect, useState } from "react";
import { getRequests, deleteRequest } from "../services/requestService.js";
import { Link } from "react-router-dom";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDeleteClick = (id) => {
    setSelectedRequestId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      setError("");

      await deleteRequest(selectedRequestId);

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== selectedRequestId),
      );

      setShowDeleteModal(false);
      setSelectedRequestId(null);

      setSuccessMessage("Maintenance request deleted successfully.");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete maintenance request.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRequests();

      setRequests(data);
    } catch (error) {
      console.error("GET REQUEST ERROR:", error);
      setError("Failed to load maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      request.title?.toLowerCase().includes(searchText) ||
      request.location?.toLowerCase().includes(searchText) ||
      request.category?.toLowerCase().includes(searchText) ||
      request.assignedTo?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Priority badge style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-gray-600">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Maintenance Requests
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track all maintenance requests.
            </p>
          </div>

          <Link
            to="/requests/new"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Request
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>

              <input
                type="text"
                placeholder="Search title, location, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </div>

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No maintenance requests match your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Title
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Location
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Priority
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Assigned To
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    {/* Title */}
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {request.title}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 text-gray-600">
                      {request.category}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-gray-600">
                      {request.location}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                          request.priority,
                        )}`}
                      >
                        {request.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          request.status,
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="px-4 py-4 text-gray-600">
                      {request.assignedTo || "Unassigned"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/requests/${request._id}/edit`}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDeleteClick(request._id)}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800">
              Delete Request
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this maintenance request? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRequestId(null);
                }}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
