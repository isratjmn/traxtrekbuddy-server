import express from "express";

import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import { Role } from "@prisma/client";
import requestValidate from "../../middlewares/requstValidate";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.get("/users", auth(Role.admin, Role.user), userController.getAllUser);

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

router.get(
	"/dashboard-data",
	auth(Role.admin),
	userController.getDashboardData
);

export const userRoute = router;
