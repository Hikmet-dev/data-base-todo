const { Router } = require('express');
const { query, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Op } = require("sequelize");

const { Task } = require('../models');
const router = Router();




router.get('/tasks',
        query('filterBy').optional({checkFalsy: true}),
        query('order').default('DESC').isString().toUpperCase(),
        query('page').default(1).isInt(),
        query('taskCount').default(100).isInt(),
        async (req, res, next) => {
            try{
                const { filterBy, order, taskCount, page}  = req.query;
                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
                };
                const orderField = {'ASC': 'ASC', 'DESC': 'DESC'};
                const filterByField = { true: true, false: false, 'done': true, 'undone': false }
                // if(!orderField[order] || !filterByField[filterBy]) {
                //     throw new ErrorHandler().badRequest('Invalid fields in query', errors.array());
                // };
                
                const { count, rows } = await Task.findAndCountAll({
                    where: {
                        done: filterByField[filterBy] ?? [true, false]
                    },
                    order: [["createdAt", orderField[order]]],
                    offset: (page - 1) * taskCount,
                    limit: taskCount
                });

                return res.json({tasks: rows, pageCount: Math.ceil(count / taskCount)});

            } catch(error) {
                next(error);
               
            }
});

module.exports = router;