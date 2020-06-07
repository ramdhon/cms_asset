const User = require('../models/user');
const log = require('../utils/log');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    User
      .deleteMany({})
      .then(function() {
        done();
      })
      .catch(function(err) {
        log(err);
      });
  }
};
