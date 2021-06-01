const { Router } = require('express');
const fs = require('fs');
const { body, param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');




const router = Router();



router.patch('/task/:idParam/', 
            body('done').isBoolean(), 
            body('name').isString().isLength({min: 3}), 
            param('idParam').isUUID(), 
            (req, res, next) => {

    const idParam = req.params['idParam'];
    const body = req.body;



    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new ErrorHandler(422, 'Invalid fields in request', errors.array());
        return next(error);
    };

    fs.readFile(__dirname + '/tasks.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }
    
            const taskList = JSON.parse(data.toString());
            const index = taskList.findIndex(item => item.id === idParam);

            if(index === -1) {
                const error = new ErrorHandler(400, "Task not found")
                return next(error)
            };
            const newObjs = {...taskList[index], ...body };
            taskList[index] = newObjs;

            

            fs.writeFile(__dirname + '/tasks.json', JSON.stringify(taskList, null, 2), (err) => {
                if(err)  {
                    console.log(err);
                }
                return res.sendStatus(200)
            });
        });
})

module.exports = router;