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
		return res.status(httpStatus.OK).json(result);
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

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
	const { userId } = req.params;
	const request = await userService.deleteUser(userId);
	ConsignResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User deleted successfully....!!!",
		data: request,
	});
});

/* const deleteUsersFromDB = asyncHandler(async (req: Request, res: Response) => {
	const { userId } = req.body;

	if (!Array.isArray(userId) || userId.length === 0) {
		return res.status(400).json({
			message: "Invalid request. 'userIds' must be a non-empty array.",
		});
	}
	const request = await userService.deleteUsers(userId);
	ConsignResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User deleted successfully....!!!",
		data: request,
	});
}); */

const getDashboardData = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const user = req.user;

		const result = await userService.getDashboardData(user);
		ConsignResponse(res, {
			success: true,
			statusCode: httpStatus.OK,
			message: "Dashboard data retrieved successfully!",
			data: result,
		});
	}
);

export const userController = {
	getAllUser,
	updateUserInfo,
	updateUserRole,
	deleteUser,
	getDashboardData,
};
