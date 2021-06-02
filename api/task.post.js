const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } =require('../models')
const router = Router();

router.post('/task',
    body('done').isBoolean().optional({checkFalsy: true}),
    body('name').trim().isString().isLength({min: 3}),
    async (req, res, next) => {
        try {
            const body = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
            };

            const findTask = await Task.findOne({where: { name: body.name }});

            if(findTask) {
                throw new ErrorHandler(404, "The task already exists")
            }

            const task = await Task.create({ ...body });
            return res.sendStatus(201).json(task);
        } catch (err) {
            console.log(err);
            next(err)
        };          
});

module.exports = router;