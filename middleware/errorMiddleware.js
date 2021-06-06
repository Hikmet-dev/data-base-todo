const { ErrorHandler } = require('../errors.js');
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) throw new ErrorHandler().badRequest('Invalid fields', errors.array());
    next()
};