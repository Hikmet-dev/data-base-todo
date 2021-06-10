const { Router } = require('express');
const router = Router();
const { body } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { User } = require('../../models');
const errorMiddleware = require('../../middleware/errorMiddleware.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/signup',
    body('firstName').trim().isString(), 
    body('lastName').trim().isString(),
    body('email').trim().isEmail(),
    body('password').isString(),
    errorMiddleware, 
    async (req, res, next) => {
    try{
        const { firstName, lastName, email, password } = req.body;

        const findUser = await User.findOne({where: {email}});
        if(findUser) throw new ErrorHandler(400, 'User already exists');

        const {id: dbId, firstName: dbFistName, lastName: dbLastName} = await User.create({firstName, lastName, email, password});

        const token = jwt.sign({id: dbId}, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(201).json({token: `Bearer ${token}`, firstName: dbFistName, lastName: dbLastName})

    } catch(error) {
        console.log(error);
        next(error);
    };       
});

module.exports = router;