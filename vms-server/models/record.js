const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;

// Record Schema
const RecordSchema = mongoose.Schema ({
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maintenance"
    }
  }, { timestamps: true });

  const Record = module.exports = mongoose.model('Record', RecordSchema);

  module.exports.addRecord = function(record) {
    return record.save();
  }

  module.exports.deleteRecord = function(id) {
    return Record.deleteOne({_id: ObjectId(id)})
  }

  module.exports.updateRecord = function(query, newValues) {
    return Record.updateOne(query, newValues);
  }