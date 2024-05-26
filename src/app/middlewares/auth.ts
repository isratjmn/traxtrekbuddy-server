import { Request, Response, NextFunction } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import APIError from "../errors/APIError";
import config from "../../config";
import { jwtUtils } from "../../Utils/jwtUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				name: string;
				role: string;
			};
		}
	}
}

const auth = (...roles: string[]) => {
	return async (
		req: Request & { user?: any },
		res: Response,
		next: NextFunction
	) => {
		try {
			const token = req.headers.authorization;
			if (!token) {
				return res.status(401).json({
					success: false,
					message: "Access denied. No token provided...!!",
					errorDetails: "Token not found..!!",
				});
			}

			const verifiedUser = jwtUtils.verifyToken(
				token,
				config.jwt.jwt_secret as Secret
			);
			const user = await prisma.user.findUnique({
				where: {
					id: verifiedUser.id,
					email: verifiedUser.email,
					name: verifiedUser.name,
					role: verifiedUser.role,
				},
			});
			if (!user || !user.role) {
				throw new Error("User not found or role is null..!!");
			}
			// Check if user has one of the required roles
			if (!roles.length || roles.includes(user.role)) {
				req.user = user;
				next();
			} else {
				throw new APIError(httpStatus.FORBIDDEN, "Forbuidden !!!");
			}
		} catch (err) {
			next(err);
		}
	};
};

export default auth;
