/* LIBRARIES */
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import moment from 'moment';

/* SCHEMA */
import {User} from '../models/userSchema';
import {Token} from '../models/tokenSchema';

/* HELPERS */
import REGEX from '../config/regex';
import CONSTANTS from '../config/constants';
import STATUS_CODE from '../config/statusCode';
import {RESPONSE} from '../helpers/responseHelper';
import {sendEmail} from '../helpers/sendEmailHelper';

dotenv.config();

export const userLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const validate = REGEX.EMAIL.test(email);

    if (!validate)
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.EMAIL_ADDRESS_REGEX,
                    {},
                    STATUS_CODE.EMAIL_ADDRESS_REGEX,
                ),
            );

    try {
        const data = await User.findOne({email: email});
        /* checker if has result for find email address */
        if (data) {
            /* checker for user if already verified the user email */
            if (data.isVerified) {
                /* password encryption */
                bcryptjs.compare(password, data.password, (err, result) => {
                    if (err)
                        return res
                            .status(400)
                            .json(
                                RESPONSE(
                                    400,
                                    CONSTANTS.NO_RESULT,
                                    err,
                                    STATUS_CODE.NO_RESULT_FOUND,
                                ),
                            );

                    /* tokenized the user info */
                    if (result) {
                        const token = jwt.sign(
                            {
                                first_name: data.first_name,
                                last_name: data.last_name,
                                email: data.email,
                                company_name: data.company_name,
                            },
                            process.env.JWT_SECRET,
                            {expiresIn: '1h'},
                        );

                        return res
                            .status(200)
                            .json(
                                RESPONSE(200, CONSTANTS.LOGIN_SUCCESS, token),
                            );
                    } else {
                        return res
                            .status(400)
                            .json(
                                RESPONSE(
                                    400,
                                    CONSTANTS.PASSWORD_ERROR,
                                    {},
                                    STATUS_CODE.PASSWORD_NOT_MATCH,
                                ),
                            );
                    }
                    /* end of tokenized  */
                });
                /* end password encryption */
            } else {
                return res
                    .status(400)
                    .json(
                        RESPONSE(
                            400,
                            CONSTANTS.EMAIL_NOT_VERIFIED,
                            {},
                            STATUS_CODE.EMAIL_NOT_VERIFIED,
                        ),
                    );
            }
            /* end of verification checker */
        } else {
            return res
                .status(400)
                .json(
                    RESPONSE(
                        400,
                        CONSTANTS.NO_RESULT,
                        {},
                        STATUS_CODE.NO_RESULT_FOUND,
                    ),
                );
        }
        /* end checker email */
    } catch (err) {
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.NO_RESULT,
                    err,
                    STATUS_CODE.NO_RESULT_FOUND,
                ),
            );
    }
};

export const userRegister = async (req, res) => {
    const password = req.body.password;
    const passwordReg = REGEX.PASSWORD.test(password);
    const emailReg = REGEX.EMAIL.test(req.body.email);

    if (!passwordReg)
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.PASSWORD_REGEX,
                    {},
                    STATUS_CODE.PASSWORD_VALIDATION_FAILED,
                ),
            );

    if (!emailReg)
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.EMAIL_ADDRESS_REGEX,
                    {},
                    STATUS_CODE.EMAIL_ADDRESS_REGEX,
                ),
            );

    try {
        bcryptjs.hash(password, 10, async (err, hashedPassword) => {
            if (err)
                return res
                    .status(400)
                    .json(
                        RESPONSE(
                            400,
                            CONSTANTS.USER_FAILED,
                            err,
                            STATUS_CODE.PASSWORD_HASHED_FAILED,
                        ),
                    );

            const post = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                company_name: req.body.company_name,
                email: req.body.email,
                password: hashedPassword,
            });

            try {
                const user = await post.save();
                await userTokenVerification(user, req, res);

                return res
                    .status(200)
                    .json(
                        RESPONSE(
                            200,
                            CONSTANTS.USER_ADDED,
                            user,
                            STATUS_CODE.ADD_USER_SUCCESS,
                        ),
                    );
            } catch (err) {
                if (err.code === 11000) {
                    return res
                        .status(400)
                        .json(
                            RESPONSE(
                                400,
                                CONSTANTS.EMAIL_ALREADY_EXISTS,
                                err,
                                STATUS_CODE.ADD_EMAIL_ALREADY_EXISTS,
                            ),
                        );
                } else {
                    return res
                        .status(500)
                        .json(
                            RESPONSE(
                                500,
                                CONSTANTS.USER_FAILED,
                                err,
                                STATUS_CODE.ADD_USER_FAILED,
                            ),
                        );
                }
            }
        });
    } catch (error) {
        return res
            .status(500)
            .json(
                RESPONSE(
                    500,
                    CONSTANTS.USER_FAILED,
                    error.message,
                    STATUS_CODE.ADD_USER_FAILED,
                ),
            );
    }
};

export const userTokenVerification = async (user, req, res) => {
    try {
        const token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex'),
        });
        await token.save();

        const MAIN_SENDER = 'noblemenemail@gmail.com';
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAIN_SENDER,
                pass: process.env.PASSWORD,
            },
        });

        const URL = `http://${req.headers.host}/api/auth/confirmation/${user._id}/${token.token}`;
        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.email,
            subject: 'Account Verification Link',
            html: `<div>Hello ${user.first_name}, <br/><br/>Please verify your account by clicking the link:<br/><a href="${URL}">Click to Verify Email address. </a><br/><br/> Thank you!</div>`,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        return res
            .status(500)
            .json(
                RESPONSE(
                    500,
                    CONSTANTS.USER_FAILED,
                    err,
                    STATUS_CODE.ADD_USER_FAILED,
                ),
            );
    }
};

export const userForgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            isActive: true,
        });

        const token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex'),
        });

        await token.save();

        const MAIN_SENDER = 'noblemenemail@gmail.com';
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAIN_SENDER,
                pass: process.env.PASSWORD,
            },
        });

        const URL = `http://${process.env.REACT_BASE_URL}/change-password?id=${user._id}&token=${token.token}`;
        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.email,
            subject: 'Account Passowrd Change',
            html: `<div>Hello ${user.first_name}, <br/><br/>Password change of your account by clicking the link:<br/><a href="${URL}">Change password link. </a><br/><br/> Thank you!</div>`,
        };

        const response = await transporter.sendMail(mailOptions);
        return res
            .status(200)
            .json(
                RESPONSE(
                    200,
                    CONSTANTS.FORGOT_EMAIL_SEND,
                    req.body,
                    STATUS_CODE.FORGOT_EMAIL_SUCCESS,
                ),
            );
    } catch (e) {
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.FORGOT_EMAIL_FAILED,
                    e.response,
                    STATUS_CODE.FORGOT_EMAIL_FAILED,
                ),
            );
    }
};

export const confirmationRegister = async (req, res, next) => {
    try {
        const token = await Token.findOne({
            _userId: req.params.id,
            token: req.params.token,
        });
        token.isVerified = true;
        await token.save();

        const user = await User.findOne({_id: req.params.id});
        user.isVerified = true;
        await user.save();

        return res.redirect(`${process.env.BASE_URL}?verification=true`);
    } catch (e) {
        return res.redirect(`${process.env.BASE_URL}?vertification=false`);
    }
};

export const changePassword = async (req, res, next) => {
    const password = req.body.password;
    const id = req.body.id;
    const tokenBody = req.body.token;
    const passwordReg = REGEX.PASSWORD.test(password);

    if (!passwordReg)
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.PASSWORD_REGEX,
                    {},
                    STATUS_CODE.PASSWORD_VALIDATION_FAILED,
                ),
            );

    const token = await Token.findOne({
        token: tokenBody,
    });

    if (!token)
        return res
            .status(400)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.TOKEN_NOT_FOUND,
                    {},
                    STATUS_CODE.TOKEN_NOT_FOUND,
                ),
            );

    try {
        const user = await User.findOne({id: id});

        bcryptjs.hash(password, 10, async (err, hashedPassword) => {
            if (err)
                return res
                    .status(400)
                    .json(
                        RESPONSE(
                            400,
                            CONSTANTS.PASSWORD_CHANGE_FAILED,
                            err,
                            STATUS_CODE.PASSWORD_CHANGE_FAILED,
                        ),
                    );

            user.password = hashedPassword;
            const response = await user.save();

            return res
                .status(200)
                .json(
                    RESPONSE(
                        200,
                        CONSTANTS.PASSWORD_CHANGE_SUCCESS,
                        response.data,
                        STATUS_CODE.PASSWORD_CHANGE_SUCCESS,
                    ),
                );
        });
    } catch (e) {
        return res
            .status(500)
            .json(
                RESPONSE(
                    400,
                    CONSTANTS.PASSWORD_CHANGE_FAILED,
                    e.response,
                    STATUS_CODE.PASSWORD_CHANGE_FAILED,
                ),
            );
    }
};
