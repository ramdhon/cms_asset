const Rentlist = require('../models/Rentlist');

module.exports = (req, res, next) => {
    const { decoded } = req;
    const { id } = req.params;

    Rentlist.findById(id)
    .populate({
        path: 'refId',
        // select: ['_id', 'name', 'email']
    })
    .then(Rentlist => {
        if (!Rentlist) {
            const err = {
                status: 404,
                message: 'data not found'
            }
            next(err);
        } else {
            if (Rentlist.refId._id != decoded._id) {
                const err = {
                    status: 401,
                    message: 'unauthorized to access'
                }
                next(err);
            } else {
                req.Rentlist = Rentlist;
                next();
            }
        }
    })
    .catch(err => {
        next(err);
    })
}