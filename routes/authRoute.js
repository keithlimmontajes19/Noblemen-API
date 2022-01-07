import express from 'express';
import { userLogin, userForgotPassword, userRegister } from '../controller/authController';

const router = express.Router();

router.post('/login', userLogin);
router.post('/forgot', userForgotPassword);
router.post('/signup', userRegister);

export default router;