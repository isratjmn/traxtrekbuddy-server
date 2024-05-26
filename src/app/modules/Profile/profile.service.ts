import { PrismaClient } from '@prisma/client';
import { IUserProfile } from './profile.interface';
const prisma = new PrismaClient();

const getUserProfile = async () => {
    const userDetails = await prisma.user.findMany(
        {
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        }
    );
    if (!userDetails)
    {
        throw new Error('User profile not found....!!');
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
                }
            },
            trips: true,
            buddyRequests: {
                include: {
                    trip: true,
                }
            }
        }
    });

    return userProfile;
};



const updateUserProfile = async (
    userId: string,
    data: {
        name: string; email: string;
    }) => {
    const updatedProfile = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: data.name,
            email: data.email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedProfile;
};

export const UserProfileServices = {
    getUserProfile,
    getMyProfile,
    updateUserProfile
};
