import { User } from '../models/userSchema';

export const userAll = async (req, res) => {
    try {
        const response = await User.find();
        return res.status(200).json({
            status: 200,
            message: 'Success get all users.',
            data: response
        })
    } catch (e) {
        return res.status(400).json({
            status: 400,
            message: 'Failed get all users.',
            data: e.message
        })
    }
}

