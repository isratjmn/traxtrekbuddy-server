import { Request, Response } from "express";
import httpStatus from "http-status";
import ConsignResponse from "../../../mutual/ConsignResponse";
import { UserProfileServices } from "./profile.service";
import asyncHandler from "../../../mutual/asyncHandler";

const getMyProfile = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const userId = req.user?.id;
		const result = await UserProfileServices.getMyProfile(userId as string);
		return res.status(httpStatus.OK).json({
			success: true,
			statusCode: httpStatus.OK,
			message: "My Profile retrieved successfully.....!!",
			data: result,
		});
	}
);

const updateProfile = asyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { bio, age } = req.body;

	if (!userId) {
		return res.status(httpStatus.UNAUTHORIZED).json({
			success: false,
			statusCode: httpStatus.UNAUTHORIZED,
			message: "User ID not found",
		});
	}

	const updatedProfile = await UserProfileServices.updateUserProfile(
		userId as string,
		{ bio, age }
	);

	return res.status(httpStatus.OK).json({
		success: true,
		statusCode: httpStatus.OK,
		message: "User profile updated successfully",
		data: updatedProfile,
	});
});

export const UserProfileControllers = {
	getMyProfile,
	updateProfile,
};
