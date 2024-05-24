"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield prisma.user.findMany({
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
});
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield prisma.user.findUnique({
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
});
const updateUserProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProfile = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: Object.assign(Object.assign({}, data), { userProfile: {
                update: Object.assign({}, data.userProfile),
            } }),
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
});
exports.UserProfileServices = {
    getUserProfile,
    getMyProfile,
    updateUserProfile,
};
