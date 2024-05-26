import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { jwtUtils } from "../../../Utils/jwtUtils";
import config from "../../../config";
import { TUser } from "../User/user.interface";

const prisma = new PrismaClient();

const createUser = async (data: TUser) => {
	const existingUser = await prisma.user.findUnique({
		where: {
			email: data.email,
		},
	});
	if (existingUser) {
		throw new APIError(httpStatus.BAD_REQUEST, "Email Already Exists!!!");
	}

	if (data.password !== data.confirmPassword) {
		throw new APIError(httpStatus.BAD_REQUEST, "Passwords do not match!!!");
	}

	const hashedPassword: string = await bcrypt.hash(data.password, 12);

	const userData = {
		name: data.name,
		email: data.email,
		password: hashedPassword,
		role: data.role,
	};

	const newUser = await prisma.$transaction(async (transactionClient) => {
		const createdUser = await transactionClient.user.create({
			data: userData,
		});
		console.log(userData);

		if (data.role === "admin") {
			await transactionClient.admin.create({
				data: {
					name: data?.name,
					email: data?.email,
					password: hashedPassword,
				},
			});
		}

		await transactionClient.userProfile.create({
			data: {
				userId: createdUser.id,
				bio:
					data.userProfile?.bio ??
					"Hi, I'm a travel buddy looking for exciting adventures!",
				age: data.userProfile?.age ?? 25,
			},
		});
		// Generate the token but do not return it
		const token = jwtUtils.generateToken(
			{
				email: userData.email,
				name: userData.name,
				role: userData.role,
			},
			config.jwt.jwt_secret as Secret,
			config.jwt.expires_in as string
		);
		return createdUser;
	});

	return newUser;
};

const loginUser = async (payload: {
	email: string;
	name: string;
	password: string;
	role?: string;
}) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email: payload.email,
			name: payload.name,
		},
	});
	if (!userData) {
		throw new APIError(httpStatus.NOT_FOUND, "User not found !!");
	}
	const passwordMatch: boolean = await bcrypt.compare(
		payload.password,
		userData.password
	);
	if (!passwordMatch) {
		throw new Error("Incorrect Password !!");
	}
	const token = jwtUtils.generateToken(
		{
			id: userData.id,
			email: userData.email,
			name: userData.name,
			role: userData.role,
		},
		config.jwt.jwt_secret as Secret,
		config.jwt.expires_in as string
	);
	return {
		id: userData.id,
		name: userData.name,
		email: userData.email,
		role: userData.role,
		token,
	};
};

interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const changePassword = async (
	user: any,
	{ currentPassword, newPassword, confirmPassword }: ChangePasswordInput
) => {
	if (newPassword !== confirmPassword) {
		throw new Error("New password and confirm password do not match");
	}
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			id: user.id,
			email: user.email,
		},
	});

	if (!userData) {
		throw new Error("User not found");
	}

	const isCorrectPassword = await bcrypt.compare(
		currentPassword,
		userData.password
	);
	if (!isCorrectPassword) {
		throw new APIError(httpStatus.UNAUTHORIZED, "Incorrect password");
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.user.update({
		where: {
			email: userData.email,
		},
		data: {
			password: hashedPassword,
		},
	});
	return {
		message: "Password changed successfully",
	};
};

export const AuthServices = {
	createUser,
	loginUser,
	changePassword,
};
