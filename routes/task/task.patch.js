const { Router } = require('express');
const { body, param } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { Task } = require('../../models');
const router = Router();
const authMiddleware = require('../../middleware/authMiddleware.js');
const errorMiddleware = require('../../middleware/errorMiddleware.js');

router.patch('/task/:idParam/', 
            body('done').optional({checkFalsy: true}).isBoolean(), 
            body('name').optional({checkFalsy: true}).trim().isString().isLength({min: 3}), 
            param('idParam').isUUID(),
            errorMiddleware,
            authMiddleware, 
            async (req, res, next) => {
            try{
                const idParam = req.params['idParam'];
                const body = req.body;
                const {id} = res.locals.user;

                const findTask = await Task.findOne({
                    where: { 
                        user_id: "03874559-bed0-4db0-8c91-ce7b62f2385e"
                    }});
                    console.log(findTask);
                if(findTask.name === body.name) throw new ErrorHandler(404, "The task already exists");

                const task = await Task.update({ ...body }, {
                    where: {
                        user_id: id,
                        id: idParam
                    }
                });
                console.log(task);
                if(!task[0]) throw new ErrorHandler(422, 'Task not found');

                return res.status(201);

            } catch (error) {
                console.log(error);
                next(error);
            };
});

module.exports = router;