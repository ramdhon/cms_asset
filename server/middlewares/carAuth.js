const Car = require('../models/Car');

module.exports = (req, res, next) => {
    const { decoded } = req;
    const { id } = req.params;

    Car.findById(id)
        .populate({
            path: 'refId',
            // select: ['_id', 'name', 'email']
        })
        .then(Car => {
            if (!Car) {
                const err = {
                    status: 404,
                    message: 'data not found'
                }
                next(err);
            } else {
                if (Car.refId._id != decoded._id && decoded.role !== 'admin' && decoded.role !== 'dataAdmin') {
                    const err = {
                        status: 401,
                        message: 'unauthorized to access'
                    }
                    next(err);
                } else {
                    req.Car = Car;
                    next();
                }
            }
        })
        .catch(err => {
            next(err);
        })
}