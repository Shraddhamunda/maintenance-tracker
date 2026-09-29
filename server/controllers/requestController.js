
const MaintenanceRequest = require("../models/MaintenanceModel.js");

// Get all maintenance requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find().sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch maintenance requests",
      error: error.message,
    });
  }
};

// Create a new maintenance request
const createRequest = async (req, res) => {
  try {
    const {title,description,category,location,priority,status,assignedTo} = req.body;
    const newRequest = await MaintenanceRequest.create({
      title:title,
      description:description,
      category:category,
      location:location,
      priority:priority,
      status:status,
      assignedTo:assignedTo
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create maintenance request",
      error: error.message,
    });
  }
};

// Update a maintenance request
const updateRequest = async (req, res) => {
  try {
    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        message: "Maintenance request not found",
      });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update maintenance request",
      error: error.message,
    });
  }
};

// Delete a maintenance request
const deleteRequest = async (req, res) => {
  try {
    const id = req.params.id
    const deletedRequest = await MaintenanceRequest.findByIdAndDelete(
      id
    );

    if (!deletedRequest) {
      return res.status(404).json({
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      message: "Maintenance request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete maintenance request",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRequests,
  createRequest,
  updateRequest,
  deleteRequest,
}

