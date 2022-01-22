import express from 'express';
import {
  userLogin,
  userForgotPassword,
  userRegister,
  confirmationRegister,
  changePassword,
} from '../controller/authController';

const router = express.Router();

router.post('/login', userLogin);
router.post('/forgot', userForgotPassword);
router.post('/signup', userRegister);
router.post('/changePassword', changePassword);
router.get('/confirmation/:id/:token', confirmationRegister);
router.get('/test', (req, res) => {
  res.send('Test Hello world');
});

export default router;
