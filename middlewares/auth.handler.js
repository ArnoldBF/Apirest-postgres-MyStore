const boom = require('@hapi/boom');

const config = require('../config/config');

const checkApyKey = (req, res, next) => {
  const apiKey = req.headers['api'];

  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
};

const checkAdminRole = (req, res, next) => {
  const user = req.user;

  if (user.role === 'admin') {
    next();
  } else {
    next(boom.unauthorized());
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.unauthorized('Insufficient permissions'));
    }
  };
};

module.exports = {
  checkApyKey,
  checkAdminRole,
  checkRole,
};
