const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;

// User Schema
const UserSchema = mongoose.Schema ({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
  },
}, { timestamps: true });

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  const query = {username: username}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;

      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.deleteUser = function(id) {
    return User.deleteOne({_id: ObjectId(id)})
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

module.exports.getUsers = function(query, role) {
    if(role != undefined){
        return User.find({role: role}, {}, query).sort({role: 1, username: 1});
    } else {
        return User.find({}, {}, query).sort({role: 1, username: 1});
    }
}

module.exports.getUsersTotalCount = function(role) {
    if(role != undefined){
        return User.count({role: role});
    } else {
        return User.count();
    }
}

module.exports.getUsersByUsernameOrPlateNumber = function(query, searchByUsernameOrPlateNumber, role){
    if(role != undefined){
        return User.find({ role: role, username: { $regex: `.*${searchByUsernameOrPlateNumber}.*`, $options: "i" } }, {}, query).sort({username: 1});
    } else {
        return User.find({ username: { $regex: `.*${searchByUsernameOrPlateNumber}.*`, $options: "i" } }, {}, query).sort({username: 1});
    }
}

module.exports.getUsersTotalCountByUsernameOrPlateNumber = function(searchByUsernameOrPlateNumber, role){
    if(role != undefined){
        return User.count({ role: role, plateNumber: { $regex: `.*${searchByUsernameOrPlateNumber}.*`, $options: "i" } });
      } else {
        return User.count({ username: { $regex: `.*${searchByUsernameOrPlateNumber}.*`, $options: "i" } });
      }
}

module.exports.updateUser = function(query, newValues){
    if(newValues.$set.password != ''){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newValues.$set.password, salt, async(err, hash) => {
              if(err) throw err;
        
              newValues.$set.password = hash;          
              return User.updateOne(query, newValues);
            });
          });
    } else {
        delete newValues.$set["password"];
        return User.updateOne(query, newValues);
    }
}