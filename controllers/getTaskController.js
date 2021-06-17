const {Task} = require('../models');
const { query } = require('express-validator');
const errorMiddleware = require('../middleware/errorMiddleware');

module.exports = 
    async (req, res, next) => {
        try {
            const {
                filterBy,
                order,
                taskCount,
                page
            } = req.query;
            const {
                id
            } = res.locals.user;

            const filterParam = {
                'done': true,
                'undone': false
            };

            const filter = {
                where: {
                    user_id: id
                }
            };
            if (order && !'') filter.order = [
                ["createdAt", order]
            ];
            if (['done', 'undone'].includes(filterBy)) filter.where.done = filterParam[filterBy];
            filter.offset = (page - 1) * taskCount;
            filter.limit = taskCount;

            const {
                count,
                rows
            } = await Task.findAndCountAll(filter);

            return res.json({
                tasks: rows,
                pageCount: Math.ceil(count / taskCount)
            });

        } catch (error) {
            next(error);
        }
    };