import { Request, Response } from "express";

import httpStatus from "http-status";
import ConsignResponse from "../../../mutual/ConsignResponse";
import asyncHandler from "../../../mutual/asyncHandler";
import { userService } from "./user.service";

const getAllUser = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const user = req.user;
		const queryParams = req.query;

		const result = await userService.getAllUser(user, queryParams);

		ConsignResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "All User retrieved successfully!",
			data: result,
		});
	}
);

const updateUserInfo = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await userService.updateUserInfo(id, req.body);

	ConsignResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User info update successfully!",
		data: result,
	});
});

const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await userService.updateUserRole(id, req.body);
	ConsignResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User role update successfully!",
		data: result,
	});
});

export const userController = {
	getAllUser,
	updateUserInfo,
	updateUserRole,
};
