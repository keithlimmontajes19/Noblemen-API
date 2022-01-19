import express from 'express';
import {postWebsiteOnboarding} from '../controller/homeController';

const router = express.Router();

router.post('/onboarding-website', postWebsiteOnboarding);

export default router;
