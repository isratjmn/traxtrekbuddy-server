import httpStatus from "http-status";
import ConsignResponse from "../../../mutual/ConsignResponse";
import { Response, Request } from "express";
import { TravelBuddyServices } from "./travelbuddy.service";
import asyncHandler from "../../../mutual/asyncHandler";

const getPotentialTravelBuddies = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const user = req.user;
		const { tripId } = req.params;

		const potentialBuddies = await TravelBuddyServices.getTravelBuddies(
			tripId
		);

		return ConsignResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "My travel buddies retrieved successfully...!!",
			data: potentialBuddies,
		});
	}
);

const getTravelRequestHistory = async (
	req: Request & { user?: any },
	res: Response
) => {
	try {
		const { userId } = req.user;
		const travelRequests =
			await TravelBuddyServices.getTravelRequestHistory(userId);
		res.status(200).json({
			success: true,
			data: travelRequests,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

const respondToRequest = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const { buddyId } = req.params;
		const { tripId, status } = req.body;
		const userId = req.user?.id;

		const response = await TravelBuddyServices.respondToTravelBuddy(
			buddyId,
			{ tripId, status },
			userId
		);
		if (!response) {
			res.status(404).json({
				success: false,
				message: "Travel buddy request not found.",
			});
			return;
		}

		ConsignResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Travel buddy request respond updated successfully.....!!",
			data: response,
		});
	}
);

export const TravelBuddyControllers = {
	getPotentialTravelBuddies,
	getTravelRequestHistory,
	respondToRequest,
};
