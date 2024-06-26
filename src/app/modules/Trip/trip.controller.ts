import { Response, Request } from "express";
import httpStatus from "http-status";
import ConsignResponse from "../../../mutual/ConsignResponse";
import { TripServices } from "./trip.service";
import asyncHandler from "../../../mutual/asyncHandler";
import { IUploadFile } from "../../../interfaces/file";
import { UploadFileHelper } from "../../../mutual/UploaderFileHelper";

//* CREATE TRIP
const createTrip = asyncHandler(async (req: Request, res: Response) => {
	const id = req?.user?.id;
	if (!id) {
		res.status(401).json({
			success: false,
			message: "Unauthorized: User ID not found",
		});
		return;
	}
	const file = req.file as IUploadFile;

	if (file) {
		const uploadedProfileImage = await UploadFileHelper.uploadToCloudinary(
			file
		);

		req.body.photos = uploadedProfileImage?.secure_url;
	}
	const tripData = {
		...req.body,
		userId: id,
	};

	const newTrip = await TripServices.createTrip(tripData);
	ConsignResponse(res, {
		success: true,
		statusCode: 201,
		message: "Trip created successfully...!!",
		data: newTrip,
	});
});

//* GETTING ALL THE TRIPS
const getTrips = asyncHandler(async (req: Request, res: Response) => {
	const result = await TripServices.getTrips(req.query);
	return res.status(httpStatus.OK).json(result);
});

//* GET A PERTICULAR TRIP
const getTrip = asyncHandler(async (req: Request, res: Response) => {
	const tripId = req.params.id;

	if (!tripId) {
		res.status(400).json({
			success: false,
			message: "Bad Request: Trip ID is required",
		});
		return;
	}
	const trip = await TripServices.getTripById(tripId);
	if (!trip) {
		res.status(404).json({
			success: false,
			message: "Trip not found...!!",
		});
		return;
	}
	ConsignResponse(res, {
		success: true,
		statusCode: 200,
		message: "Trip details fetched successfully...!!",
		data: trip,
	});
});

//* TREVEL REQUEST
const sendRequest = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const user = req.user;
		const { tripId } = req.params;
		// const userId = req.body?.userId;
		const response = await TripServices.sendTravelBuddyRequest(
			user,
			tripId,
			req.body
		);
		// Remove the adminId field from the response data
		const { adminId, ...responseData } = response;
		ConsignResponse(res, {
			statusCode: httpStatus.CREATED,
			success: true,
			message: "Travel buddy request sent successfully....!!!",
			data: responseData,
		});
	}
);

//* TREVEL DELETE
const deleteTrip = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const request = await TripServices.deleteTrip(id);
	ConsignResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Trip deleted successfully....!!!",
		data: request,
	});
});

//* TREVEL UPDATE
const updateTrip = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const payload = req.body;
	const request = await TripServices.updateTrip(id, payload);

	ConsignResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Trip updated successfully....!!!",
		data: request,
	});
});

export const TripControllers = {
	createTrip,
	getTrips,
	getTrip,
	sendRequest,
	deleteTrip,
	updateTrip,
};
