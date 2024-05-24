import express from "express";
import { UserProfileControllers } from "./profile.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get(
	"/",
	auth(Role.user, Role.admin),
	UserProfileControllers.getUserProfile
);

router.get(
	"/my-profile",
	auth(Role.user, Role.admin),
	UserProfileControllers.getMyProfile
);

router.patch(
	"/:id",
	auth(Role.user, Role.admin),
	// requestvalidate(UserProfileValidation.UpdateProfileSchema),
	UserProfileControllers.updateProfile
);

export const profileRoutes = router;
