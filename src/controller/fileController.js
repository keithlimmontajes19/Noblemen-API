import {File} from '../models/fileSchema';
import {User} from '../models/userSchema';

import {RESPONSE} from '../helpers/responseHelper';
import STATUS_CODE from '../config/statusCode';
import CONSTANTS from '../config/constants';

export const uploadFiles = async (req, res, next) => {
  const {filename, path, mimetype} = req.file;
  const localUser = res.locals.user;

  try {
    const user = await User.findOne({email: localUser.email});
    const upload = new File({
      _userId: user.id,
      fileName: filename,
      filePath: path,
      fileType: mimetype,
    });

    const response = await upload.save();
    return res
      .status(200)
      .json(
        RESPONSE(
          200,
          CONSTANTS.FILE_UPLOAD_SUCCESS,
          response,
          STATUS_CODE.FILE_UPLOAD_SUCCESS,
        ),
      );
  } catch (err) {
    return res
      .status(401)
      .json(
        RESPONSE(
          401,
          CONSTANTS.FILE_UPLOAD_FAILED,
          err.response,
          STATUS_CODE.FILE_UPLOAD_FAILED,
        ),
      );
  }
};
