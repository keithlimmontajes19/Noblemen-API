const User = require('../models/userSchema');

const userAll = (req, res, next) => {
    User.find()
        .then(data => res.status(200).json({
            status: 200,
            message: 'Success get all users.',
            data: data
        }))
        .catch(err => res.status(400).json({
            status: 400,
            message: 'Failed get all users.',
            data: []
        }))
}

module.exports = {
    userAll,
}