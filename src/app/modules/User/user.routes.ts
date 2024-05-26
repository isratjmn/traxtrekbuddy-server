import express from "express";

import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import { Role } from "@prisma/client";
import requestValidate from "../../middlewares/requstValidate";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/users", auth(Role.admin, Role.admin), userController.getAllUser);

router.patch(
	"/:id/status",
	auth(Role.admin),
	requestValidate(UserValidation.updateStatus),
	userController.updateUserInfo
);

router.patch(
	"/:id/role",
	auth(Role.admin),
	// requestValidate(userValidation.userRoleUpdateValidation),
	userController.updateUserRole
);

export const userRoute = router;
