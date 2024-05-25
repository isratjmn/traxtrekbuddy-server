import httpStatus from "http-status";
import APIError from "../../errors/APIError";
import {
	PrismaClient,
	Role,
	TravelBuddyStatus,
	UserStatus,
} from "@prisma/client";
import { buildUserQueryParams } from "../../../Utils/buildUserQueryParams";
const prisma = new PrismaClient();

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
				userProfile: true,
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
	const defaultProfileImage =
		"https://res.cloudinary.com/dmr810p4l/image/upload/v1717297396/2150771125_osnw4b.jpg";
	const modifiedUsers = users.map((user) => {
		return {
			...user,
			userProfile: {
				...user.userProfile,
				profileImage:
					user.userProfile?.profileImage || defaultProfileImage,
			},
		};
	});
	return {
		success: true,
		statusCode: httpStatus.OK,
		message: "User info update successfully!",
		meta: {
			page: pageNumber,
			limit: limitNumber,
			total: totalCount,
		},
		data: modifiedUsers,
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

const deleteUser = async (userId: string) => {
	const deleteResult = await prisma.$transaction(async (prisma) => {
		// Delete related UserProfile records first
		await prisma.userProfile.deleteMany({
			where: {
				userId: userId,
			},
		});
		// Delete related Admin records
		await prisma.admin.deleteMany({
			where: {
				id: userId,
			},
		});
		// Delete the user
		const userDeletion = await prisma.user.delete({
			where: {
				id: userId,
			},
		});
		return userDeletion;
	});
	return deleteResult;
};

/* const deleteUsers = async (userIds: string[]) => {
	const deletedUsers = [];
	for (const userId of userIds) {
		const result = await prisma.$transaction(async (prisma) => {
			// Delete related UserProfile records first
			await prisma.userProfile.deleteMany({
				where: {
					userId: userId,
				},
			});

			// Delete related Admin records
			await prisma.admin.deleteMany({
				where: {
					id: userId,
				},
			});
			// Delete the user
			const userDeletion = await prisma.user.delete({
				where: {
					id: userId,
				},
			});
			return userDeletion;
		});
		deletedUsers.push(result);
	}
	return deletedUsers;
}; */

const getDashboardData = async (user: any) => {
	const adminDetails = await prisma.user.findFirst({
		where: {
			id: user?.id,
			role: user?.role,
		},
	});

	if (!adminDetails) {
		throw new APIError(404, "Admin is not found....!!");
	}
	const totalTrip = await prisma.trip.count({});
	const totalUser = await prisma.user.count({});
	const totalActiveUser = await prisma.user.count({
		where: {
			status: UserStatus.ACTIVE,
		},
	});
	const totalDeActiveUser = await prisma.user.count({
		where: {
			status: UserStatus.DEACTIVE,
		},
	});
	const totalTripRequest = await prisma.travelBuddyRequest.count({});
	const totalTripRequestPending = await prisma.travelBuddyRequest.count({
		where: {
			status: TravelBuddyStatus.PENDING,
		},
	});
	const totalTripRequestApproved = await prisma.travelBuddyRequest.count({
		where: {
			status: TravelBuddyStatus.APPROVED,
		},
	});
	const totalTripRequestRejected = await prisma.travelBuddyRequest.count({
		where: {
			status: TravelBuddyStatus.REJECTED,
		},
	});

	return {
		totalTrip,
		totalUser,
		totalActiveUser,
		totalDeActiveUser,
		totalTripRequest,
		totalTripRequestPending,
		totalTripRequestApproved,
		totalTripRequestRejected,
	};
};

export const userService = {
	getAllUser,
	updateUserInfo,
	updateUserRole,
	deleteUser,
	getDashboardData,
};
