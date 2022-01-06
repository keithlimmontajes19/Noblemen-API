require('dotenv/config');

/* LIBRARIES */
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* SCHEMA */
const User = require('../models/userSchema');

/* HELPERS */
const Email = require('../helpers/sendEmailHelper');

const userLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(data => {
            if (data) {
                bcryptjs.compare(password, data.password, (err, result) => {
                    if (err) res.json({ status: 400, message: 'No result found.', data: err })

                    if (result) {
                        const token = jwt.sign({ name: data.name, username: data.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        res.json({ status: 200, message: 'Login Succesfully!', data: token });
                    } else {
                        res.json({ status: 400, message: 'Password does not match!', data: err })
                    }
                })
            } else {
                res.json({ status: 400, message: 'No result found.', data: err })
            }
        })
        .catch(err => res.status(400).json({ status: 400, message: 'No result found.', data: err }))
}


const userForgotPassword = (req, res, next) => {
    Email.sendEmail(req, res, next)
}


const userRegister = (req, res, next) => {
    bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) res.json({ error: err.response })

        const post = new User({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        post.save()
            .then(data => res.status(200).json({
                status: 200,
                message: 'User sucessfully added!',
                data: data
            }))
            .catch(err => res.status(400).json({
                status: 400,
                message: 'Failed to add.',
                data: err.response
            }))
    });

}
module.exports = {
    userLogin,
    userForgotPassword,
    userRegister
}