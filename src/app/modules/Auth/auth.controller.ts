import { Request, Response } from "express";
import ConsignResponse from "../../../mutual/ConsignResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import asyncHandler from "../../../mutual/asyncHandler";
import config from "../../../config";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, confirmPassword, role } = req.body;
	const result = await AuthServices.createUser({
		name,
		email,
		password,
		confirmPassword,
		role,
	});

	ConsignResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User registered successfully.....!!",
		data: {
			id: result.id,
			name: result.name,
			email: result.email,
			role: result.role,
		},
	});
});

const login = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, role } = req.body;
	const result = await AuthServices.loginUser({
		name,
		email,
		password,
		role,
	});
	ConsignResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User Login Successfully......!!",
		data: {
			id: result.id,
			name: result.name,
			email: result.email,
			role: result.role,
			token: result.token,
		},
	});
});

const changePassword = asyncHandler(
	async (req: Request & { user?: any }, res: Response) => {
		const user = req.user;
		const { currentPassword, newPassword, confirmPassword } = req.body;
		const result = await AuthServices.changePassword(user, {
			currentPassword,
			newPassword,
			confirmPassword,
		});

		ConsignResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Password changed successfully....",
			data: result,
		});
	}
);

export const AuthControllers = {
	registerUser,
	login,
	changePassword,
};
