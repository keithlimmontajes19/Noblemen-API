require('dotenv/config');

const nodemailer = require("nodemailer");

const sendEmail = async (req, res, next) => {
    const MAIN_SENDER = 'noblemenemail@gmail.com';

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: MAIN_SENDER,
            pass: process.env.PASSWORD,
        },
    });

    transporter.sendMail({
        from: `Noblemen Support ${MAIN_SENDER}`,
        to: req.body.email,
        subject: "Forgot Password",
        html: "<b>Hello world?</b>",
    }, (error, info) => {
        if (error) {
            res.json({
                status: 400,
                message: `Failed sent ${req.body.email}`,
                data: error
            })
        } else {
            res.json({
                status: 200,
                message: `Email sent to ${req.body.email}`,
                data: info
            })
        }
    });

}

module.exports = {
    sendEmail
}