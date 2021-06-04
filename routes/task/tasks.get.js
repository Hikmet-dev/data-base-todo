const { Router } = require('express');
const { query } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');


router.get('/tasks',
        query('filterBy').optional({checkFalsy: true}).isBoolean(),
        query('order').isString().toUpperCase().optional({checkFalsy: true}),
        query('page').default(1).isInt(), 
        query('taskCount').default(100).isInt(),
        errorMiddleware,
        authMiddleware,
        async (req, res, next) => {
            try{
                const { filterBy, order, taskCount, page}  = req.query;
                const {id, email } = res.locals.user;

                const filter = { where: {user_id: id}}
                if (order && !'') filter.order = [["createdAt", order]];
                if (filterBy !== "" && filterBy !== undefined) filter.where.done = filterBy;
                filter.offset = (page - 1) * taskCount;
                filter.limit = taskCount;

                const { count, rows } = await Task.findAndCountAll(filter);

                if(!rows[0]){
                    throw new ErrorHandler(404, 'Not tasks')
                }

                return res.json({tasks: rows, pageCount: Math.ceil(count / taskCount)});

            } catch(error) {
                next(error);
            }
    });

module.exports = router;