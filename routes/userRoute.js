import express from 'express';
import {userAll, tokenUserChecker} from '../controller/userController';

const router = express.Router();

router.get('/getAll', userAll);
router.get('/getOne', userAll); // TO DO:
router.get('/token', tokenUserChecker);

export default router;
