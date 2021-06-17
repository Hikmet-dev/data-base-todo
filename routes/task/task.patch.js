const { Router } = require('express');
const { body, param, query } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');
const getTaskController = require('../../controllers/getTaskController');

router.patch('/task/:idParam/', 
            body('done').isBoolean().optional({checkFalsy: true}), 
            body('name').trim().isString().isLength({min: 3}).optional({checkFalsy: true}), 
            param('idParam').isUUID(),
            query('filterBy').optional({checkFalsy: true}).isString().isIn(['all', 'done', 'undone']),
            query('order').isString().toUpperCase().isIn(['ASC', 'DESC']).optional({checkFalsy: true}),
            query('page').default(1).isInt(),
            query('taskCount').default(100).isInt(),
            errorMiddleware,
            authMiddleware, 
            async (req, res, next) => {
            try{
                const idParam = req.params['idParam'];
                const body = req.body;
                const {id} = res.locals.user;

                const findTask = await Task.findOne({
                    where: { 
                        user_id: id
                    }});
                if (!findTask) throw new ErrorHandler.badRequest("Task not found")  
                if(findTask.name === body.name) throw new ErrorHandler(404, "The task already exists");

                const task = await Task.update({ ...body }, {
                    where: {
                        user_id: id,
                        id: idParam
                    }
                });
                if(!task[0]) throw new ErrorHandler(422, 'Task not found');

                next()
            } catch (error) {
                console.log(error);
                next(error);
            };
}, getTaskController);

module.exports = router;