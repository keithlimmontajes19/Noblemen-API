import express from 'express';
import {uploadFiles} from '../controller/fileController';
import path from 'path';

const router = express.Router();
const __dirname = path.resolve();

router.post('/post', uploadFiles);
router.get('/get', (req, res) => {
  res.sendFile(path.join(__dirname, './uploads/file-2022-01-20-main-logo.png'));
});

export default router;
