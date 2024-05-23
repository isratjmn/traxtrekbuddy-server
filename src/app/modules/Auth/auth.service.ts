import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import APIError from '../../middlewares/APIError';
import httpStatus from 'http-status';
import { jwtUtils } from '../../../Utils/jwtUtils';
import config from '../../../config';
import { TUser } from '../User/user.interface';

const prisma = new PrismaClient();

const createUser = async (data: TUser) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            id: data.id,
            email: data.email,
        },
    });

    if (existingUser)
    {
        throw new APIError(httpStatus.BAD_REQUEST, 'Email Already Exists!!!');
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
            include: {
                userProfile: true
            }
        });
        console.log(userData);

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


const loginUser = async (payload: { email: string, name: string, password: string, role?: string; }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            name: payload.name,

        },
    });
    if (!userData)
    {
        throw new APIError(httpStatus.NOT_FOUND, 'User not found !!');
    }
    const passwordMatch: boolean = await bcrypt.compare(payload.password, userData.password);
    if (!passwordMatch)
    {
        throw new Error('Incorrect Password !!');
    }
    const token = jwtUtils.generateToken({
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

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,

        },
    });

    const isCorrectPassword = await bcrypt.compare(payload.currentPassword, userData.password);

    if (!isCorrectPassword)
    {
        throw new APIError(httpStatus.UNAUTHORIZED, "Incorrect password");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

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
    changePassword
};