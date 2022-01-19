import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CONSTANTS from '../config/constants';
import {RESPONSE} from './responseHelper';
import STATUS_CODE from '../config/statusCode';

dotenv.config();

export const authorize = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const tokenBody = token.slice(7);

        jwt.verify(tokenBody, process.env.JWT_SECRET, async (err) => {
            if (err) {
                return res
                    .status(403)
                    .json(
                        RESPONSE(
                            401,
                            CONSTANTS.UNAUTHORIZE,
                            err,
                            STATUS_CODE.TOKEN_EXPIRED,
                        ),
                    );
            } else {
                next();
            }
        });
    } catch (e) {
        return res
            .status(401)
            .send(
                RESPONSE(
                    401,
                    CONSTANTS.UNAUTHORIZE,
                    {},
                    STATUS_CODE.TOKEN_EXPIRED,
                ),
            );
    }
};

export const checkUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const tokenBody = token.slice(7);

        jwt.verify(
            tokenBody,
            process.env.JWT_SECRET,
            async (err, decodedToken) => {
                if (err) {
                    res.locals.user = null;
                    next();
                } else {
                    res.locals.user = decodedToken;
                    next();
                }
            },
        );
    } catch (e) {
        return res
            .status(401)
            .send(
                RESPONSE(
                    401,
                    CONSTANTS.UNAUTHORIZE,
                    {},
                    STATUS_CODE.TOKEN_EXPIRED,
                ),
            );
    }
};
