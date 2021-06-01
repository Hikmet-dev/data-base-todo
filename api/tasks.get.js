const { Router } = require('express');
const { query, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { Op } = require("sequelize");

const { Task } = require('../models');
const router = Router();




router.get('/tasks',
        query('filterBy').isBoolean().optional({checkFalsy: true}),
        query('order').isString().toUpperCase().optional({checkFalsy: true}),
        query('page').isInt().optional({checkFalsy: true}),
        query('taskCount').isInt().optional({checkFalsy: true}),
        async (req, res, next) => {
            try{
                const { filterBy, order = 'DESC', taskCount = 100, page = 1}  = req.query;
                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler(422, 'Invalid fields in request', errors.array());
                };
                const orderField = {'ASC': 'ASC', 'DESC': 'DESC', '': 'DESC'};
                const filterByField = {true: true, false: false}

                if(!orderField[order]){
                    throw new ErrorHandler(422, 'Invalid query value')
                };
                
                const tasks = await Task.findAll({
                    where: {
                      done: 'all'
                    },
                    order: [["createdAt", orderField[order] ]],
                    offset: (page - 1) * taskCount,
                    limit: taskCount
                });

                // const pageCount = Math.ceil(tasks.length / taskCount);
                // const activePage = page <= pageCount ? page : pageCount;
                // const sliceTasksList = tasks.slice((activePage - 1) * taskCount, activePage * taskCount);

                return res.json(tasks)

            } catch(error) {
                next(error);
               
            }
});

module.exports = router;