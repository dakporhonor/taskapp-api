// jshint esversion: 8
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = jwt.verify(token, 'osogom');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }
    // Grant route handler access to user already fetched from db
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      error: 'User not authorised'
    });
  }
}

module.exports = auth;