const mongoose = require("mongoose");

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Electrical", "Plumbing", "IT", "HVAC", "Equipment", "Other"],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      required: true,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },

    assignedTo: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "maintenancerequest",
  MaintenanceRequestSchema
);