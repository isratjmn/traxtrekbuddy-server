import express from "express";
import { authRoutes } from "../modules/Auth/auth.routes";

import { tripRoutes, tripsRoutes } from "../modules/Trip/trip.routes";
import { travelBuddyRoutes } from "../modules/TravelBuddy/travelbuddy.routes";
import { profileRoutes } from "../modules/Profile/profile.routes";
import { userRoute } from "../modules/User/user.routes";

const router = express.Router();

const moduleRoutes = [
	{
		path: "/",
		route: authRoutes,
	},
	{
		path: "/trips",
		route: tripsRoutes,
	},
	{
		path: "/trip",
		route: tripRoutes,
	},
	{
		path: "/travel-buddies",
		route: travelBuddyRoutes,
	},
	{
		path: "/profile",
		route: profileRoutes,
	},
	{
		path: "/",
		route: userRoute,
	},
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
