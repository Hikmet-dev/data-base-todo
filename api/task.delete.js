const { Router } = require('express');
const fs = require('fs');
const { param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models');


const router = Router();


router.delete('/task/:idParam', 
            param('idParam').isUUID(), 
            async (req, res, next) => {
            try{
                const idParam = req.params.idParam;

                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler(422, 'Invalid fields in request', errors.array());
                };

                const task = await Task.destroy({
                    where: {
                        uuid: idParam
                    }
                });
                if (!task) {
                    throw new ErrorHandler(422, 'Itask not faund');
                }
                return res.sendStatus(200);
            } catch (error) {
                next(error)
            }
        });

module.exports = router;