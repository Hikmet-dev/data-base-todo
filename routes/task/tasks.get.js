const { Router } = require('express');
const { query } = require('express-validator');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');


router.get('/tasks',
    query('filterBy').optional({checkFalsy: true}).isString().isIn(['all', 'done', 'undone']),
    query('order').isString().toUpperCase().isIn(['ASC', 'DESC']).optional({checkFalsy: true}),
    query('page').default(1).isInt(), 
    query('taskCount').default(100).isInt(),
    errorMiddleware,
    authMiddleware,
    async (req, res, next) => {
        try{
            const { filterBy, order, taskCount, page}  = req.query;
            const {id} = res.locals.user;
            
            const filterParam = {'done': true, 'undone': false};

            const filter = { where: {user_id: id}};
            if (order && !'') filter.order = [["createdAt", order]];
            if (['done', 'undone'].includes(filterBy)) filter.where.done = filterParam[filterBy];
            filter.offset = (page - 1) * taskCount;
            filter.limit = taskCount;

            const { count, rows } = await Task.findAndCountAll(filter);

            return res.json({tasks: rows, pageCount: Math.ceil(count / taskCount)});

        } catch(error) {
            next(error);
        }
    });

module.exports = router;