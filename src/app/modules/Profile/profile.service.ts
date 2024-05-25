import { PrismaClient } from "@prisma/client";
import { TUser } from "../User/user.interface";
const prisma = new PrismaClient();

const getMyProfile = async (userId: string) => {
	const defaultProfileImage =
		"https://res.cloudinary.com/dmr810p4l/image/upload/v1717297396/2150771125_osnw4b.jpg";

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
					profileImage: true,
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

	if (userProfile) {
		// Ensure userProfile exists before accessing its properties
		const modifiedUserProfile = {
			...userProfile,
			userProfile: {
				...userProfile.userProfile,
				profileImage:
					userProfile.userProfile?.profileImage ||
					defaultProfileImage,
			},
		};

		return modifiedUserProfile;
	}

	return null;
};

const updateUserProfile = async (data: Partial<TUser>) => {
	if (!data.id) {
		throw new Error("User ID is required for updating the profile");
	}

	// Update user and userProfile in a single transaction
	const updatedProfile = await prisma.user.update({
		where: {
			id: data.id,
		},
		data: {
			name: data.name,
			email: data.email,
			userProfile: data.userProfile
				? {
						update: {
							bio: data.userProfile.bio,
							age: data.userProfile.age,
							profileImage: data.userProfile.profileImage,
						},
				  }
				: undefined,
		},
		select: {
			id: true,
			name: true,
			role: true,
			email: true,
			userProfile: {
				select: {
					bio: true,
					age: true,
				},
			},
		},
	});
	return updatedProfile;
};

export const UserProfileServices = {
	getMyProfile,
	updateUserProfile,
};
