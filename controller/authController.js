
/* LIBRARIES */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

/* SCHEMA */
import { User } from '../models/userSchema';
import { Token } from '../models/tokenSchema';

/* HELPERS */
import REGEX from '../config/regex';
import CONSTANTS from '../config/constants';
import STATUS_CODE from '../config/statusCode';
import { RESPONSE } from '../helpers/responseHelper';
import { sendEmail } from '../helpers/sendEmailHelper';

dotenv.config();

export const userLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const validate = REGEX.EMAIL.test(email);

    if (!validate) res.status(400).json(RESPONSE(400, CONSTANTS.EMAIL_ADDRESS_REGEX, {}, STATUS_CODE.EMAIL_ADDRESS_REGEX))

    try {
        const data = await User.findOne({ email: email });

        if (data) {
            bcryptjs.compare(password, data.password, (err, result) => {
                if (err) return res.status(400).json(RESPONSE(400, CONSTANTS.NO_RESULT, err, STATUS_CODE.NO_RESULT_FOUND))

                if (result) {
                    const token = jwt.sign({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        company_name: data.company_name
                    }, process.env.JWT_SECRET, { expiresIn: '1h' });

                    return res.status(200).json(RESPONSE(200, CONSTANTS.LOGIN_SUCCESS, token));
                } else {
                    return res.status(400).json(RESPONSE(400, CONSTANTS.PASSWORD_ERROR, {}, STATUS_CODE.PASSWORD_NOT_MATCH))
                }
            })
        } else res.json(RESPONSE(400, CONSTANTS.NO_RESULT, err, STATUS_CODE.NO_RESULT_FOUND))

    } catch (err) {
        return res.status(400).json(RESPONSE(400, CONSTANTS.NO_RESULT, err, STATUS_CODE.NO_RESULT_FOUND))
    }

}

export const userRegister = async (req, res) => {
    const password = req.body.password;
    const passwordReg = REGEX.PASSWORD.test(password);
    const emailReg = REGEX.EMAIL.test(req.body.email);

    if (!passwordReg) return res.status(400).json(RESPONSE(400, CONSTANTS.PASSWORD_REGEX, {}, STATUS_CODE.PASSWORD_VALIDATION_FAILED));
    if (!emailReg) return res.status(400).json(RESPONSE(400, CONSTANTS.EMAIL_ADDRESS_REGEX, {}, STATUS_CODE.EMAIL_ADDRESS_REGEX))

    try {
        bcryptjs.hash(password, 10, async (err, hashedPassword) => {
            if (err) return res.status(400).json(RESPONSE(400, CONSTANTS.USER_FAILED, err, STATUS_CODE.PASSWORD_HASHED_FAILED))

            const post = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                company_name: req.body.company_name,
                email: req.body.email,
                password: hashedPassword
            });

            try {
                const user = await post.save();
                await userTokenVerification(user, req);

                return res.status(200).json(RESPONSE(200, CONSTANTS.USER_ADDED, user, STATUS_CODE.ADD_USER_SUCCESS))
            } catch (err) {
                if (err.code === 11000) {
                    return res.status(400).json(RESPONSE(400, CONSTANTS.EMAIL_ALREADY_EXISTS, err, STATUS_CODE.ADD_EMAIL_ALREADY_EXISTS))
                } else {
                    return res.status(500).json(RESPONSE(500, CONSTANTS.USER_FAILED, err, STATUS_CODE.ADD_USER_FAILED))
                }
            }
        })
    } catch (error) {
        return res.status(500).json(RESPONSE(500, CONSTANTS.USER_FAILED, error.message, STATUS_CODE.ADD_USER_FAILED))
    }
}

export const userTokenVerification = async (user, req) => {
    try {
        const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        const MAIN_SENDER = 'noblemenemail@gmail.com';
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAIN_SENDER,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.email,
            subject: 'Account Verification Link',
            text: 'Hello ' + user.first_name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
        };

        await transporter.sendMail(mailOptions);

    } catch (err) {
        return res.status(500).json(RESPONSE(500, CONSTANTS.USER_FAILED, err, STATUS_CODE.ADD_USER_FAILED))
    }


}

export const userForgotPassword = (req, res, next) => sendEmail(req, res, next);


