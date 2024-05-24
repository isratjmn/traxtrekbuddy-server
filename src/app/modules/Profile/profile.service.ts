import { PrismaClient } from "@prisma/client";
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

const updateUserProfile = async (
	userId: string,
	data: Partial<{ bio: string; age: number }>
) => {
	const updatedProfile = await prisma.userProfile.update({
		where: {
			userId: userId,
		},
		data: {
			bio: data.bio,
			age: data.age,
		},
		select: {
			id: true,
			bio: true,
			age: true,
			user: {
				select: {
					name: true,
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
