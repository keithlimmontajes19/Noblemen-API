import express from 'express';
import { userAll } from '../controller/userController';

const router = express.Router();

router.get('/get', userAll);

export default router;