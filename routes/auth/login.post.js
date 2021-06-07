const { Router } = require('express');
const router = Router();
const { body, validationResult } = require('express-validator');
const { ErrorHandler } = require('../../errors.js');
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login',
    body('email').trim().isEmail(),
    body('password').isString(),
    async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors) throw new ErrorHandler().badRequest('Invalid fields in request', errors.array());
        const { email: reqEmail, password: reqPassword } = req.body;

        const {id, firstName, lastName, email, password }  = await User.findOne({where: {email: reqEmail}});
        if(!email) throw new ErrorHandler(400, 'User does not exist');

        const passVerif = bcrypt.compareSync(reqPassword, password);
        if(!passVerif) throw new ErrorHandler(400, 'Wrong password');
        const token = await jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: "1h" });
        
        return res.json({token: `Bearer ${token}`, firstName, lastName, email });

    } catch(error) {
        console.log(error);
        next(error)
    }
}); 

module.exports = router;