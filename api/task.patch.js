const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models');
const router = Router();

router.patch('/task/:idParam/', 
            body('done').isBoolean().optional({checkFalsy: true}), 
            body('name').trim().isString().isLength({min: 3}).optional({checkFalsy: true}), 
            param('idParam').isUUID(), 
            async (req, res, next) => {
            try{
                const idParam = req.params['idParam'];
                const body = req.body;

                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
                };

                const task = await Task.update({ ...body }, {
                    where: {
                        uuid: idParam
                    }
                });
                if(!task[0]){
                    throw new ErrorHandler(422, 'Task not found')
                }

                res.json(task);

            } catch (error) {
                console.log(error);
                next(error);
            };
});

module.exports = router;