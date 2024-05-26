import express from 'express';
import { UserProfileControllers } from './profile.controller';
import auth from '../../middlewares/auth';
import requestvalidate from '../../middlewares/requstValidate';
import { UserProfileValidation } from './profile.validation';

const router = express.Router();

router.get('/', auth("user"), UserProfileControllers.getUserProfile);

router.get('/my-profile', auth("user", "admin"), UserProfileControllers.getMyProfile);

router.put('/', auth("user", "admin"), requestvalidate(UserProfileValidation.UpdateProfileSchema), UserProfileControllers.updateProfile);

export const profileRoutes = router;