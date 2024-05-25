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
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const defaultProfileImage = "https://res.cloudinary.com/dmr810p4l/image/upload/v1717297396/2150771125_osnw4b.jpg";
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
        const modifiedUserProfile = Object.assign(Object.assign({}, userProfile), { userProfile: Object.assign(Object.assign({}, userProfile.userProfile), { profileImage: ((_a = userProfile.userProfile) === null || _a === void 0 ? void 0 : _a.profileImage) ||
                    defaultProfileImage }) });
        return modifiedUserProfile;
    }
    return null;
});
const updateUserProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.id) {
        throw new Error("User ID is required for updating the profile");
    }
    // Update user and userProfile in a single transaction
    const updatedProfile = yield prisma.user.update({
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
});
exports.UserProfileServices = {
    getMyProfile,
    updateUserProfile,
};
