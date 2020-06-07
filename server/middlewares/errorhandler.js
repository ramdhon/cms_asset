const log = require('../utils/log');
module.exports = (err, req, res, next) => {
  const { error, status, message, name } = err;

  log('ERROR LOG:', err);
  
  if (error) {
    log({ message: 'ERROR AT TRY CATCH', error });
  }
  if (status) {
    res.status(status).json({ message });
  } else {
    if (name === 'ValidationError') {
      res.status(400).json({ message });
    } else {
      res.status(500).json({ message: 'internal server error' });
    }
  }
}