const Rentitem = require('../models/Rentitem');

module.exports = (req, res, next) => {
    const { decoded } = req;
    const { id } = req.params;

    Rentitem.findById(id)
        .populate({
            path: 'refId',
            // select: ['_id', 'name', 'email']
        })
        .then(Rentitem => {
            if (!Rentitem) {
                const err = {
                    status: 404,
                    message: 'data not found'
                }
                next(err);
            } else {
                if (Rentitem.refId._id != decoded._id && decoded.role !== 'admin') {
                    const err = {
                        status: 401,
                        message: 'unauthorized to access'
                    }
                    next(err);
                } else {
                    req.Rentitem = Rentitem;
                    next();
                }
            }
        })
        .catch(err => {
            next(err);
        })
}