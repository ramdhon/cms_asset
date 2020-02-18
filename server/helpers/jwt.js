const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sulapjs';

module.exports = {
    sign: function(obj) {
        // process.env.JWT_SECRET
        return jwt.sign(obj, JWT_SECRET)
    },

    decode: function(accesstoken) {
        return jwt.verify(accesstoken, JWT_SECRET)
    }
}