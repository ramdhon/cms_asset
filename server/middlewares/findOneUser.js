const User = require('../models/user');

module.exports = (req, res, next) => {
  const { id } = req.params;

  User
    .findById(id)
    .then(user => {
      if (!user) {
        const err = {
          status: 404,
          message: 'user not found'
        }
        return next(err);
      }

      req.user = user;
      next();
    })
    .catch(err => {
      next(err);
    })
}