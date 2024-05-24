import { PrismaClient } from "@prisma/client";
import { IUserProfile } from "./profile.interface";
const prisma = new PrismaClient();

const getUserProfile = async () => {
	const userDetails = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			userProfile: true,
		},
	});
	if (!userDetails) {
		throw new Error("User profile not found....!!");
	}
	return userDetails;
};

const getMyProfile = async (userId: string) => {
	const userProfile = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			userProfile: {
				select: {
					bio: true,
					age: true,
				},
			},
			trips: true,

			buddyRequests: {
				select: {
					status: true,
					trip: {
						select: {
							destination: true,
						},
					},
				},
			},
		},
	});

	return userProfile;
};

const updateUserProfile = async (
	userId: string,
	data: Partial<{
		name: string;
		userProfile: {
			bio: string;
			age: number;
		};
	}>
) => {
	const updatedProfile = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			...data,
			userProfile: {
				update: {
					...data.userProfile,
				},
			},
		},
		select: {
			id: true,
			name: true,
			email: true,
			userProfile: {
				select: {
					bio: true,
					age: true,
				},
			},
			createdAt: true,
			updatedAt: true,
		},
	});
	return updatedProfile;
};

export const UserProfileServices = {
	getUserProfile,
	getMyProfile,
	updateUserProfile,
};
