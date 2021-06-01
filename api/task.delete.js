const { Router } = require('express');
const fs = require('fs');
const { param, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');


const router = Router();


router.delete('/task/:idParam', 
            param('idParam').isUUID(), 
            (req, res, next) => {
            try{
                const idParam = req.params.idParam;

                const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    throw new ErrorHandler(422, 'Invalid fields in request', errors.array());
                };

                fs.readFile(__dirname + '/tasks.json', 'utf-8', (err, data) => {
                    if (err) {
                        throw new ErrorHandler(404, 'not found file')
                    };

                    const taskList = JSON.parse(data.toString());

                    const taskIndex =  taskList.findIndex(item => item.id === idParam);
                    if(taskIndex === -1) { 
                        throw new ErrorHandler(400, "Task not found");
                        
                    }; 

                    const newTaskList = taskList.filter((item, index) => index !== taskIndex);
                    
                    fs.writeFile(__dirname + '/tasks.json', JSON.stringify(newTaskList, null, 2), (err) => {
                        if(err)  {
                            console.log(err);
                        };
                        return res.sendStatus(200);
                    })
                });
            } catch (error) {
                next(error)
            }
        });

module.exports = router;