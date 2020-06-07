const Example = require('../models/EXAMPLE');
const log = require('../utils/log');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    Example
      .deleteMany({})
      .then(function() {
        done();
      })
      .catch(function(err) {
        log(err);
      });
  }
};
