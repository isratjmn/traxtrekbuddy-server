
import { Request, Response } from 'express';
import ConsignResponse from '../../../mutual/ConsignResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';
import asyncHandler from '../../../mutual/asyncHandler';
import { UserService } from '../User/user.service';


const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const result = await AuthServices.createUser(req.body);

        ConsignResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'User registered successfully.....!!',
            data: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role
            }
        });
    }
);



const login = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const result = await AuthServices.loginUser({ name, email, password, role });
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
        }
    });

});


const changePassword = asyncHandler(async (req: Request & { user?: any; }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePassword(user, req.body);

    ConsignResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully",
        data: {
            status: 200,
            message: "Password changed successfully",
        },
    });
});


export const AuthControllers = {
    registerUser,
    login,
    changePassword,
};
