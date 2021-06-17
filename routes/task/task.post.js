const { Router } = require('express');
const { body, query } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { Task } = require('../../models')
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');
const getTaskController = require('../../controllers/getTaskController');

router.post('/task',
    body('done').isBoolean().optional({checkFalsy: true}),
    body('name').trim().isString().isLength({min: 3}),
    query('filterBy').optional({checkFalsy: true}).isString().isIn(['all', 'done', 'undone']),
    query('order').isString().toUpperCase().isIn(['ASC', 'DESC']).optional({checkFalsy: true}),
    query('page').default(1).isInt(),
    query('taskCount').default(100).isInt(),
    errorMiddleware,
    authMiddleware,
    async (req, res, next) => {
        try {
            const body = req.body;
            const {id} = res.locals.user;
            const { filterBy, order, taskCount, page}  = req.query;

            const findTask = await Task.findOne({where: {user_id: id, name: body.name}});

            if(findTask) throw new ErrorHandler(404, "The task already exists");

            await Task.create({ ...body, user_id: id });
            next();        
        } catch (err) {
            console.log(err);
            next(err)
        };          
}, getTaskController);

module.exports = router;