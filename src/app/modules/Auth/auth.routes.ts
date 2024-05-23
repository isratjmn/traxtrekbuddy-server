
import express from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation, registerSchema } from './auth.validation';
import requestValidate from '../../middlewares/requstValidate';

const router = express.Router();

router.post('/register',
    requestValidate(AuthValidation.registerSchema),
    AuthControllers.registerUser);
router.post('/login', AuthControllers.login);

export const authRoutes = router;
