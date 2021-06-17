const { Router } = require('express');
const { query } = require('express-validator');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const getTaskController = require('../../controllers/getTaskController');
const errorMiddleware = require('../../middleware/errorMiddleware');

router.get('/tasks',
    query('filterBy').optional({checkFalsy: true}).isString().isIn(['all', 'done', 'undone']),
    query('order').isString().toUpperCase().isIn(['ASC', 'DESC']).optional({checkFalsy: true}),
    query('page').default(1).isInt(),
    query('taskCount').default(100).isInt(),
    errorMiddleware,
    authMiddleware,
    getTaskController);

module.exports = router;