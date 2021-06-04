const { ErrorHandler } = require('../errors.js');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token) {
            throw new ErrorHandler(400, 'User is not logged in');
        };

        jwt.verify(token.split(' ')[1], 'memasik', (err, decoded) => {
            if(err) {
                throw new ErrorHandler(400, 'Invalid token');
            }
            res.locals.user = decoded;
        });
        next();
    } catch(error) {
        console.log(error);
        next(error);
    }
};