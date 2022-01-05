require('dotenv/config');

const jwt = require('jsonwebtoken');

module.exports = () => {
    return (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).send({ status: 401, message: 'Unauthorize. Access Denied!', data: {} })
        } else {
            const tokenBody = token.slice(7);
            jwt.verify(tokenBody, process.env.JWT_SECRET, (err, decoded) => {
                if (err) res.json({ status: 401, message: `Unauthorized, Access denied!`, data: err })

                next();
            });

        }

    }
}