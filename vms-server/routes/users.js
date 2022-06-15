const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User ({
    name: req.body.name,
    email: req.body.email,
    telephone: req.body.telephone,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  });

  User.addUser(newUser, (err, user) => {
    if(err) {
      res.json({success: false, msg: 'Failed to register user'});
    } else {
      res.json({success: true, msg: 'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            telephone: user.telephone,
            role: user.role
          }
        })
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

// Get All Users
router.get('/', passport.authenticate('jwt', {session:false}), async (req, res, next) => {
  const pageNo = parseInt(req.query.pageNo);
  const size = parseInt(req.query.size);
  const searchByUsernameOrPlateNumber = req.query.search || null;
  const role = req.query.role;

  if(pageNo < 0 || pageNo === 0) {
    return res.json({success: false, msg: "invalid page number, should start with 1"})
  }

  var query = {};
  query.skip = size * (pageNo - 1);
  query.limit = size;

  let totalCount;
  let users;

  if(searchByUsernameOrPlateNumber){
    totalCount = await User.getUsersTotalCountByUsernameOrPlateNumber(searchByUsernameOrPlateNumber, role);
    users = await User.getUsersByUsernameOrPlateNumber(query, searchByUsernameOrPlateNumber, role);
  } else {
    totalCount = await User.getUsersTotalCount(role);
    users = await User.getUsers(query, role);
  }

  res.json({success: true, users: users, count: totalCount});
})

// Get All Users
router.delete('/:id', passport.authenticate('jwt', {session:false}), async (req, res, next) => {
  await User.deleteUser(req.params.id);
  res.json({success: true});
})

// Update User
router.put('/', passport.authenticate('jwt', {session:false}), async(req, res, next) => {
  const _id = req.body.id;
  const role = req.body.role;
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const telephone = req.body.telephone;
  const password = req.body.password;

  const query = { _id };
  const newvalues = { $set: {role, name, username, email, telephone, password}};

  const _res = await User.updateUser(query, newvalues);

  res.json({success: true, msg: 'User updated', res: _res});
});

module.exports = router;