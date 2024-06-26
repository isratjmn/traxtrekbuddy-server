import express from "express";
import { UserProfileControllers } from "./profile.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get(
	"/my-profile",
	auth(Role.user, Role.admin),
	UserProfileControllers.getMyProfile
);

router.put(
	"/edit-profile",
	auth(Role.admin, Role.user),
	UserProfileControllers.updateProfile
);

export const profileRoutes = router;
