const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models')
const router = Router();
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/task',
    body('done').isBoolean().optional({checkFalsy: true}),
    body('name').trim().isString().isLength({min: 3}),
    authMiddleware,
    async (req, res, next) => {
        try {
            const body = req.body;
            const {id, email} = res.locals.user;
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
            };

            const findTask = await Task.findOne({where: {user_id: id, name: body.name}});

            if(findTask) {
                throw new ErrorHandler(404, "The task already exists")
            }

            const task = await Task.create({ ...body, user_id: id });
            return res.json(task);
        } catch (err) {
            console.log(err);
            next(err)
        };          
});

module.exports = router;