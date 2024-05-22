import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { TUser } from "./user.interface";

const prisma = new PrismaClient();

/* const createUser = async (data: TUser) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
            role: data.role
        },
    });
    if (existingUser)
    {
        throw new Error('Email Already Exists!!!');
    }
    const hashedPassword: string = await bcrypt.hash(data.password, 12);
    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        userProfile: {
            create: {
                bio: data.userProfile.bio,
                age: data.userProfile.age
            }
        }
    };
    const newUserAndProfile = await prisma.$transaction(async (transactionClient) => {
        const createUserData = await transactionClient.user.create({
            data: userData,
            include: {
                userProfile: true
            }
        });
        return createUserData;
    });
    return newUserAndProfile;
}; */


const createUser = async (data: TUser) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser)
    {
        throw new Error('Email Already Exists!!!');
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 12);

    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        userProfile: {
            create: {
                bio: data.userProfile.bio,
                age: data.userProfile.age
            }
        }
    };

    const newUser = await prisma.$transaction(async (transactionClient) => {
        const createdUser = await transactionClient.user.create({
            data: userData,
            include: {
                userProfile: true
            }
        });

        if (data.role === 'admin')
        {
            await transactionClient.admin.create({
                data: {
                    name: data?.name,
                    email: data?.email,
                    password: hashedPassword,

                }
            });
        }

        return createdUser;
    });

    return newUser;
};

export const UserService = {
    createUser
};