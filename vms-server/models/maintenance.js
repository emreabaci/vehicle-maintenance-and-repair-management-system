const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

// Maintenance Schema
const MaintenanceSchema = mongoose.Schema ({
  type: {
    type: Number,
    default: 0
  },
    description: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
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

  module.exports.deleteMaintenance = function(id) {
    return Maintenance.deleteOne({_id: ObjectId(id)})
  }

  module.exports.getMaintenances = function(query, type) {
    if(type != undefined){
      return Maintenance.find({type: type}, {}, query).populate("createdBy", "name username").sort({createdAt: -1});
    } else {
      return Maintenance.find({}, {}, query).populate("createdBy", "name username").sort({createdAt: -1});
    }
  }

  module.exports.getMaintenancesTotalCount = function(type) {
    if(type != undefined){
      return Maintenance.count({type: type});
    } else {
      return Maintenance.count();
    }
  }

  module.exports.getMaintenancesByPlateNumber = function(query, plateNumber, type) {
    if(type != undefined){
      return Maintenance.find({ type: type, plateNumber: { $regex: `.*${plateNumber}.*`, $options: "i" } }, {}, query).populate("createdBy", "name username").sort({createdAt: -1});
    } else {
      return Maintenance.find({ plateNumber: { $regex: `.*${plateNumber}.*`, $options: "i" } }, {}, query).populate("createdBy", "name username").sort({createdAt: -1});
    }
  }

  module.exports.getMaintenancesTotalCountByPlateNumber = function(plateNumber, type) {
    if(type != undefined){
      return Maintenance.count({ type: type, plateNumber: { $regex: `.*${plateNumber}.*`, $options: "i" } });
    } else {
      return Maintenance.count({ plateNumber: { $regex: `.*${plateNumber}.*`, $options: "i" } });
    }
  }

  module.exports.updateMaintenance = function(query, newValues) {
    return Maintenance.updateOne(query, newValues);
  }

  module.exports.getMaintenancesByAggrate = function(){
    return Maintenance.aggregate([
      {$match: {type: 0}},
      { $group : { _id : {type: "$type", plateNumber: "$plateNumber"} } } ] );
  }

  module.exports.getRepaitsByAggrate = function(){
    return Maintenance.aggregate([
      {$match: {type: 1}},
      { $group : { _id : {type: "$type", plateNumber: "$plateNumber"} } } ] );
  }
