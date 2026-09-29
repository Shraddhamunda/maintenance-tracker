import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRequests } from "../services/requestService";

const Dashboard = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all maintenance requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRequests();

        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Calculate dashboard statistics
  const totalRequests = requests.length;

  const openRequests = requests.filter(
    (request) => request.status === "Open"
  ).length;

  const inProgressRequests = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved"
  ).length;

  const highPriorityRequests = requests.filter(
    (request) => request.priority === "High"
  ).length;

  // Dynamic priority badge
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

  // Dynamic status badge
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
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

        {/* Header + Quick Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Maintenance Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Overview of maintenance requests.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/requests")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View All Requests
            </button>

            <button
              onClick={() => navigate("/requests/new")}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Create Request
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total Requests */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-800">
              {totalRequests}
            </p>
          </div>

          {/* Open Requests */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Open
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {openRequests}
            </p>
          </div>

          {/* In Progress */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {inProgressRequests}
            </p>
          </div>

          {/* Resolved */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedRequests}
            </p>
          </div>

          {/* High Priority */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              High Priority
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {highPriorityRequests}
            </p>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Requests
            </h2>

            <button
              onClick={() => navigate("/requests")}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No maintenance requests found.
              </p>

              <button
                onClick={() => navigate("/requests/new")}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Create your first request
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assigned To</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.slice(0, 5).map((request) => (
                    <tr
                      key={request._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
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
                            request.priority
                          )}`}
                        >
                          {request.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="px-4 py-4 text-gray-600">
                        {request.assignedTo || "Not Assigned"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

