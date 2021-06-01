const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } =require('../models')

const router = Router();





router.post('/task', 
    body('done').isBoolean(), 
    body('name').isString().isLength({min: 3}), 
    async (req, res, next) => {
        try {
            const { name, done } = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw new ErrorHandler(422, 'Invalid fields in request', errors.array());
            };

            const task = await Task.create({ name, done });
            return res.json(task);
        } catch (err) {
            console.log(err);
            next(err)
        }          
});

module.exports = router;