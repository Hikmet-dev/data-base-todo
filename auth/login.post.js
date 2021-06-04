const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { User } = require('../models');
const bcrypt = require('bcrypt');



router.post('/login',
    body('email').isEmail(),
    body('password').isString(),
    async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors) {
            throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
        }
        const { email, password } = req.body;

        const findUser = await User.findOne({where: {email}});
        if(findUser) {
            throw new ErrorHandler(400, 'User already exists');
        };

        res.json(findUser);
        // const sdaasd = bcrypt.compareSync()



    } catch(error) {
        console.log(error);
        next(error)
    }
        

}); 