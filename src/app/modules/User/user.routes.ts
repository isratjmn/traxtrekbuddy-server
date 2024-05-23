import express from 'express';
import requestvalidate from '../../middlewares/requstValidate';
import { UserValidation } from './user.validation';

const router = express.Router();


export const userRoutes = router;