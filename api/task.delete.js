const { Router } = require('express');
const { param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware.js');

router.delete('/task/:idParam', 
    param('idParam').isUUID(),
    authMiddleware, 
    async (req, res, next) => {
    try{
        const idParam = req.params.idParam;
        const {id} = req.user;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
        };

        const task = await Task.destroy({
            where: {
                user_id: id,
                id: idParam
            }
        });
        if (!task) {
            throw new ErrorHandler().notFound('Task not found');
        }
        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
});

module.exports = router;