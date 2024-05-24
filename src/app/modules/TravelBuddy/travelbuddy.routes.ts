import express from "express";
import { TravelBuddyControllers } from "./travelbuddy.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.get(
	"/:tripId",
	auth(Role.user, Role.admin),
	TravelBuddyControllers.getPotentialTravelBuddies
);
router.get(
	"/history",
	auth(Role.user, Role.admin),
	TravelBuddyControllers.getTravelRequestHistory
);

router.put(
	"/:buddyId/respond",
	auth(Role.user, Role.admin),
	TravelBuddyControllers.respondToRequest
);

export const travelBuddyRoutes = router;
