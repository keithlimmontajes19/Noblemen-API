import express from 'express';
import {
  userAll,
  userDetails,
  tokenUserChecker,
} from '../controller/userController';

const router = express.Router();

router.get('/getAll', userAll);
router.get('/getOne', userDetails); 
router.get('/token', tokenUserChecker);

export default router;
