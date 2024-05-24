import auth from "../../middlewares/auth";
import { TripControllers } from "./trip.controller";
import express, { Request, Response, NextFunction } from "express";
import { TripsValidation } from "./trip.validation";
import { UploadFileHelper } from "../../../mutual/UploaderFileHelper";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
	"/",
	auth(Role.user, Role.admin),
	UploadFileHelper.upload.single("file"),
	(req: Request, res: Response, next: NextFunction) => {
		req.body = TripsValidation.CreateTripSchema.parse(
			JSON.parse(req.body.data)
		);
		console.log(req.body);
		return TripControllers.createTrip(req, res, next);
	}
);

router.get("/", TripControllers.getTrips);

router.get("/:id", auth(Role.user, Role.admin), TripControllers.getTrip);

router.post(
	"/:tripId/request",
	auth(Role.user, Role.admin),
	TripControllers.sendRequest
);

router.delete("/:id", auth(Role.user, Role.admin), TripControllers.deleteTrip);

router.patch(
	"/:id",
	// auth(Role.user, Role.admin),
	TripControllers.updateTrip
);

export { router as tripRoutes, router as tripsRoutes };
