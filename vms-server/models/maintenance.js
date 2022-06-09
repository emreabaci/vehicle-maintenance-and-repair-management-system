const mongoose = require('mongoose');

// Maintenance Schema
const MaintenanceSchema = mongoose.Schema ({
    description: {
      type: String,
      required: true
    },
    creatorUserId: {
      type: String,
      required: true
    },
    plateNumber: {
      type: String,
      required: true
    },
  }, { timestamps: true });

  const Maintenance = module.exports = mongoose.model('Maintenance', MaintenanceSchema);

  module.exports.addMaintenance = function(maintenance) {
    return maintenance.save();
  }

  module.exports.getMaintenances = function() {
    return Maintenance.find();
  }
