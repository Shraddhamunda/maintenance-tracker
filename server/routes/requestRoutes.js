
const express = require("express");

const router = express.Router();

const {
  getAllRequests,
  createRequest,
  updateRequest,
  deleteRequest,
} = require("../controllers/requestController.js");

// Get all maintenance requests
router.get("/", getAllRequests);

// Create a new maintenance request
router.post("/", createRequest);

// Update a maintenance request
router.put("/:id", updateRequest);

// Delete a maintenance request
router.delete("/:id", deleteRequest);

module.exports = router;

