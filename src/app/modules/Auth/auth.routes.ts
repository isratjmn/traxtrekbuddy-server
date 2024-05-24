import express from "express";
import { AuthControllers } from "./auth.controller";
import requestValidate from "../../middlewares/requstValidate";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
	"/register",
	// requestValidate(AuthValidation.registerSchema),
	AuthControllers.registerUser
);
router.post("/login", AuthControllers.login);

router.post(
	"/change-password",
	auth(Role.admin),
	AuthControllers.changePassword
);

export const authRoutes = router;
