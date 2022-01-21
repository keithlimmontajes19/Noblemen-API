import express from 'express';
import {
  postWebsiteOnboarding,
  postCreativeProvider,
} from '../controller/homeController';

const router = express.Router();

router.post('/onboarding-website', postWebsiteOnboarding);
router.post('/onboarding-creative', postCreativeProvider);

export default router;
