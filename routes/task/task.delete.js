const { Router } = require('express');
const { param } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');

router.delete('/task/:idParam', 
    param('idParam').isUUID(),
    errorMiddleware,
    authMiddleware, 
    async (req, res, next) => {
    try{
        const idParam = req.params.idParam;
        const {id} = res.locals.user;

        const task = await Task.destroy({
            where: {
                user_id: id,
                id: idParam
            }
        });
        
        if (!task) throw new ErrorHandler().notFound('Task not found');

        return res.sendStatus(200);
    } catch (error) {
        next(error)
    }
});

module.exports = router;