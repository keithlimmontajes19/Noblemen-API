import {User} from '../models/userSchema';
import {RESPONSE} from '../helpers/responseHelper';
import CONSTANTS from '../config/constants';
import STATUS_CODE from '../config/statusCode';

export const userAll = async (req, res) => {
    try {
        const response = await User.find();
        return res.status(200).json({
            status: 200,
            message: 'Success get all users.',
            data: response,
        });
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: 'Failed get all users.',
            data: e.message,
        });
    }
};

export const tokenUserChecker = async (req, res) => {
    try {
        return res
            .status(200)
            .json(
                RESPONSE(
                    200,
                    CONSTANTS.TOKEN_VALID,
                    {},
                    STATUS_CODE.TOKEN_VALID,
                ),
            );
    } catch (e) {
        return res
            .status(403)
            .json(
                RESPONSE(
                    403,
                    CONSTANTS.TOKEN_EXPIRED,
                    {},
                    STATUS_CODE.TOKEN_EXPIRED,
                ),
            );
    }
};
