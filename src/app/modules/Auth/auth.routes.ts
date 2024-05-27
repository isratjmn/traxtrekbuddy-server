import express, { Request, Response, NextFunction } from "express";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/register", AuthControllers.registerUser);

/* router.post(
	"/register",
	UploadFileHelper.upload.single("file"),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = AuthValidation.registerSchema.parse(
			JSON.parse(req.body.data)
		);
		return AuthControllers.registerUser(req, res, next);
	}
); */

router.post("/login", AuthControllers.login);

router.post(
	"/change-password",
	auth(Role.admin, Role.user),
	AuthControllers.changePassword
);

export const authRoutes = router;
