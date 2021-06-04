const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const { Op } = require("sequelize");


router.patch('/task/:idParam/', 
            body('done').optional({checkFalsy: true}).isBoolean(), 
            body('name').optional({checkFalsy: true}).trim().isString().isLength({min: 3}), 
            param('idParam').isUUID(),
            authMiddleware, 
            async (req, res, next) => {
            try{
                const idParam = req.params['idParam'];
                const body = req.body;
                const {id, email} = req.user;
                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
                };

                const findTask = await Task.findOne({
                    where: { 
                        user_id: "03874559-bed0-4db0-8c91-ce7b62f2385e",
                        [Op.and]:[ {name: body.name}, {done: body.done} ]
                    }});
                    console.log(findTask);
                // if(findTask) {
                //     throw new ErrorHandler(404, "The task already exists")
                // };

                const task = await Task.update({ ...body }, {
                    where: {
                        user_id: id,
                        id: idParam
                    }
                });
                console.log(task);
                if(!task[0]){
                    throw new ErrorHandler(422, 'Task not found')
                }

                return res.sendStatus(201);

            } catch (error) {
                console.log(error);
                next(error);
            };
});

module.exports = router;