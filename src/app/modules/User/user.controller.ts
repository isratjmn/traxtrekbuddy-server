
import { Response, Request, NextFunction } from 'express';
import { UserService } from './user.service';
import asyncHandler from '../../../mutual/asyncHandler';
import ConsignResponse from '../../../mutual/ConsignResponse';
import httpStatus from 'http-status';
import { TUser } from './user.interface';


/* export const createUser = asyncHandler(async (req: Request, res: Response) => {

    const userData: TUser = req.body;
    // Call the createUser service function
    const newUser = await UserService.createUser(userData);
    ConsignResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Created Successfully",
        data: userData
    });

}); */

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role, userProfile } = req.body;

    try
    {
        const newUser = await UserService.createUser({
            name,
            email,
            password,
            role,
            userProfile
        });

        res.status(201).json({
            success: true,
            message: role === 'admin' ? "Admin created successfully!" : "User created successfully!",
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                userProfile: newUser.userProfile
            }
        });
    } catch (error: any)
    {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});



export const UserControllers = {
    createUser
};