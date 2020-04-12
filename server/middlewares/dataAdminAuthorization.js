module.exports = (req, res, next) => {
  const { decoded } = req;

  if (decoded.role !== 'admin' && decoded.role !== 'dataAdmin') {
    const err = {
      status: 400,
      message: 'unauthorized user found'
    }

    return next(err);
  }

  next();
}