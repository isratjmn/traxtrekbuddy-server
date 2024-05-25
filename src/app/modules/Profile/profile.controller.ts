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

const updateProfile = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		if (req.user && !req.body.id) {
			req.body.id = req.user.id;
		}
		const updatedProfile = await UserProfileServices.updateUserProfile(
			req.body
		);

		return res.status(httpStatus.OK).json({
			success: true,
			statusCode: httpStatus.OK,
			message: "User profile updated successfully",
			data: updatedProfile,
		});
	}
);

export const UserProfileControllers = {
	getMyProfile,
	updateProfile,
};
