import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { buildUserQueryParams } from "../../../Utils/buildUserQueryParams";

const prisma = new PrismaClient();

/* const getAllUser = async (user: any) => {
	const adminDetails = await prisma.user.findFirst({
		where: {
			id: user?.id,
			role: user?.role,
		},
	});

	if (!adminDetails) {
		throw new APIError(404, "Admin is not found!");
	}

	const result = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
		},
	});
	return result;
}; */

const getAllUser = async (user: any, queryParams: any) => {
	const adminDetails = await prisma.user.findFirst({
		where: {
			id: user?.id,
			role: user?.role,
		},
	});

	if (!adminDetails) {
		throw new APIError(404, "Admin not found!");
	}

	// Ensure queryParams is always an object
	queryParams = queryParams || {};

	const { where, pageNumber, limitNumber, sortBy, sortOrder } =
		buildUserQueryParams(queryParams);

	const [users, totalCount] = await Promise.all([
		prisma.user.findMany({
			where,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				status: true,
			},
			orderBy: sortBy
				? {
						[sortBy]: sortOrder || "desc",
				  }
				: { email: "asc" },
			take: limitNumber,
			skip: (pageNumber - 1) * limitNumber,
		}),
		prisma.user.count({ where }),
	]);

	return {
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total: totalCount,
		},
		data: users,
	};
};

const updateUserInfo = async (userId: string, status: UserStatus) => {
	const userInfo = await prisma.user.findFirstOrThrow({
		where: {
			id: userId,
		},
	});

	if (!userInfo) {
		throw new APIError(httpStatus.BAD_REQUEST, "User does not exists!");
	}

	const result = await prisma.user.update({
		where: {
			id: userId,
		},
		data: status,
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
		},
	});

	return result;
};

const updateUserRole = async (userId: string, role: Role) => {
	const isUserExist = await prisma.user.findFirst({
		where: {
			id: userId,
		},
	});

	if (!isUserExist) {
		throw new APIError(httpStatus.BAD_REQUEST, "User does not exists!");
	}

	const result = await prisma.user.update({
		where: {
			id: userId,
		},
		data: role,
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
		},
	});

	return result;
};

export const userService = {
	getAllUser,
	updateUserInfo,
	updateUserRole,
};
