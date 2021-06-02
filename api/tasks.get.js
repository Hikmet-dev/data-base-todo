const { Router } = require('express');
const { query, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Task } = require('../models');
const router = Router();

router.get('/tasks',
        query('filterBy').optional({checkFalsy: true}),
        query('order').isString().toUpperCase().optional({checkFalsy: true}),
        query('page').default(1).isInt(),
        query('taskCount').default(100).isInt(),
        async (req, res, next) => {
            try{
                const { filterBy, order, taskCount, page}  = req.query;
                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
                };

                const orderField = {'ASC': 'ASC', 'DESC': 'DESC', 'ASCENDING': 'ASC', 'DESCENDING': 'DESC' };
                const filterByField = { true: true, false: false, 'done': true, 'undone': false};

                if(!orderField[order] && order) {
                    throw new ErrorHandler().badRequest('Invalid value in query', { value: order, param: 'order', location: 'query'});
                };

                if(!filterByField[filterBy] && filterBy) {
                    throw new ErrorHandler().badRequest('Invalid value in query', { value: filterBy, param: 'filterBy', location: 'query'});
                };
                
                const { count, rows } = await Task.findAndCountAll({
                    where: {
                        done: filterByField[filterBy] ?? [true, false]
                    },
                    order: [["createdAt", orderField[order] ?? 'DESC']],
                    offset: (page - 1) * taskCount,
                    limit: taskCount
                });

                if(!rows[0]){
                    throw new ErrorHandler(404, 'Not tasks')
                }

                return res.json({tasks: rows, pageCount: Math.ceil(count / taskCount)});

            } catch(error) {
                next(error);
            }
    });

module.exports = router;