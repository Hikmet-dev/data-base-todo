const { Router } = require('express');
const { param, query } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');
const getTaskController = require('../../controllers/getTaskController');

router.delete('/task/:idParam', 
    param('idParam').isUUID(),
    query('filterBy').optional({checkFalsy: true}).isString().isIn(['all', 'done', 'undone']),
    query('order').isString().toUpperCase().isIn(['ASC', 'DESC']).optional({checkFalsy: true}),
    query('page').default(1).isInt(),
    query('taskCount').default(100).isInt(),
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

        next()
    } catch (error) {
        next(error)
    }
}, getTaskController);

module.exports = router;