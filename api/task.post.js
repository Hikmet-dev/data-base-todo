import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import { ErrorHandler } from '../errors.js';


const app = express();
const router = Router();
const __dirname = path.resolve();





router.post('/task', 
            body('done').isBoolean(), 
            body('name').isString().isLength({min: 3}), 
            (req, res, next) => {

            const body = req.body;

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                const error = new ErrorHandler(422, 'Invalid fields in request', errors.array());
                return next(error);
            };

            const newElem = {
                id: uuidv4(),
                ...body,
                created_at: new Date(Date.now())
            };

            fs.readFile(__dirname + '/tasks.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err.message
                }

                const taskList = JSON.parse(data);

                taskList.push(newElem);
                
                fs.writeFile(__dirname + '/tasks.json', JSON.stringify(taskList, null, 2), (err) => {
                    if(err)  {
                        console.log(err);
                    }; 
                    return res.sendStatus(201)
                });
            });

            
});

export default router;