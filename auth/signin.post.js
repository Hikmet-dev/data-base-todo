const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');
const { ErrorHandler } = require('../errors.js');
const { User } = require('../models');
const bcrypt = require('bcrypt');


router.post('/signin',
    body('firstName').isString(), 
    body('lastName').isString(),
    body('email').isEmail(),
    body('password').isString(), 
    async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
        };
        const { firstName, lastName, email, password } = req.body;

        const findUser = await User.findOne({where: {email}});
        if(findUser) {
            throw new ErrorHandler(400, 'User already exists');
        };
        const hashedPassword = bcrypt.hashSync(password, 7);

       const newUser = await User.create({firstName, lastName, email, hashedPassword})


        return res.json(newUser);
    } catch(error) {
        console.log(error);
        next(error);
    };       
});

module.exports = router;