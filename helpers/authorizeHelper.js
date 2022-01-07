import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CONSTANTS from '../config/constants';
import { RESPONSE } from './responseHelper';

dotenv.config();

export const authorize = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const tokenBody = token.slice(7);

        await jwt.verify(tokenBody, process.env.JWT_SECRET, (err) => {
            if (err) {
                return res.json(RESPONSE(401, CONSTANTS.UNAUTHORIZE, err))
            }
            next();
        });
    } catch (e) {
        return res.status(401).send(RESPONSE(401, CONSTANTS.UNAUTHORIZE, {}))
    }
}
