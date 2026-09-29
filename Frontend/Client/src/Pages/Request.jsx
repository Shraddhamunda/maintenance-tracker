import { useEffect, useState } from "react";
import { getRequests, deleteRequest } from "../services/requestService.js";
import { Link } from "react-router-dom";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRequest(id);

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== id),
      );
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete maintenance request.");
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);

      console.log("Fetching requests...");

      const data = await getRequests();

      console.log("Data received from server:", data);

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

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Maintenance Requests</h1>

      {requests.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No maintenance requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-medium">{request.title}</td>

                  <td className="px-4 py-3">{request.category}</td>

                  <td className="px-4 py-3">{request.location}</td>

                  <td className="px-4 py-3">{request.priority}</td>

                  <td className="px-4 py-3">{request.status}</td>

                  <td className="px-4 py-3">
                    {request.assignedTo || "Unassigned"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/requests/${request._id}/edit`}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(request._id)}
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
  );
};

export default Requests;
