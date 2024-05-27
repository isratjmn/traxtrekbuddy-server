import { Request, Response } from "express";
import ConsignResponse from "../../../mutual/ConsignResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import asyncHandler from "../../../mutual/asyncHandler";

/* const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, confirmPassword, role } = req.body;

	const file = req.file as IUploadFile;

	if (file) {
		const uploadedProfileImage = await UploadFileHelper.uploadToCloudinary(
			file
		);
		req.body.profileImage = uploadedProfileImage?.secure_url;
	}

	// Declare userProfile and initialize it with an empty object
	let userProfile: any = {};

	const result = await AuthServices.createUser({
		name,
		email,
		password,
		confirmPassword,
		role,
		userProfile: {
			profileImage: req.body.profileImage,
		},
	});
	console.log(result);

	ConsignResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User registered successfully.....!!",
		data: {
			id: result.id,
			name: result.name,
			email: result.email,
			role: result.role,
			profileImage: userProfile?.profileImage,
		},
	});
}); */

const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { name, email, password, confirmPassword, role, userProfile } =
		req.body;
	const result = await AuthServices.createUser({
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
