import express from "express";
import { TravelBuddyControllers } from "./travelbuddy.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
	"/:tripId",
	auth("user", "admin"),
	TravelBuddyControllers.getPotentialTravelBuddies
);
router.get(
	"/history",
	auth("user", "admin"),
	TravelBuddyControllers.getTravelRequestHistory
);

router.put(
	"/:buddyId/respond",
	auth("user", "admin"),
	TravelBuddyControllers.respondToRequest
);

export const travelBuddyRoutes = router;
