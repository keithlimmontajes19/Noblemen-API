import express from 'express';
import { userAll, tokenUserChecker } from '../controller/userController';

const router = express.Router();

router.get('/get', userAll);
router.get('/token', tokenUserChecker);

export default router;