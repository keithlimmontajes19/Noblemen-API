require('dotenv/config');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* Schema */
const User = require('../models/userSchema');

/* helpers */
const Email = require('../helpers/sendEmailHelper');

const userLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(data => {
            if (data) {
                bcryptjs.compare(password, data.password, (err, result) => {
                    err && res.json({ status: 400, message: 'No result found.', data: err })

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

module.exports = {
    userLogin,
    userForgotPassword
}