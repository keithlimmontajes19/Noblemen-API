const User = require('../models/userSchema');
const bcryptjs = require('bcryptjs');

const userRegister = (req, res, next) => {

    bcryptjs.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) res.json({ error: err.response })

        const post = new User({
            name: req.body.name,
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

const userAll = (req, res, next) => {
    User.find()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(400).json([]))
}

module.exports = {
    userRegister,
    userAll,
}