const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models');




const router = Router();



router.patch('/task/:idParam/', 
            body('done').isBoolean(), 
            body('name').isString().isLength({min: 3}), 
            param('idParam').isUUID(), 
            async (req, res, next) => {
            try{
                const idParam = req.params['idParam'];
                const {name, done} = req.body;


                const task = await Task.update({name, done}, {
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
            }
});

module.exports = router;