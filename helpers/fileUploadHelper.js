import multer from 'multer';
import moment from 'moment';

export const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, `file-${moment().format('YYYY-MM-DD')}-${file.originalname}`);
  },
});

export const upload = multer({storage: storage});
