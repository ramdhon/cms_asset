module.exports = (req, res, next) => {
  const { decoded } = req;
  const { editGranted } = req.query;

  if (decoded.role !== 'admin' && decoded.role !== 'dataAdmin' && editGranted !== 'true') {
    const err = {
      status: 400,
      message: 'unauthorized user found'
    }

    return next(err);
  }

  next();
}