import { Request, Response } from "express";
import ConsignResponse from "../../../mutual/ConsignResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import asyncHandler from "../../../mutual/asyncHandler";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, confirmPassword, role, userProfile } =
		req.body;
	const result = await AuthServices.createUser({
		id: "",
		name,
		email,
		password,
		confirmPassword,
		role,
		userProfile: {
			profileImage: userProfile?.profileImage,
		},
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
			userProfile: result?.userProfile?.profileImage,
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
