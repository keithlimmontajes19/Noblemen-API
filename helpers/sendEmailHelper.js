import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (req, res) => {
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

