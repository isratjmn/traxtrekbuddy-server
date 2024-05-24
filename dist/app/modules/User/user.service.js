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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const client_1 = require("@prisma/client");
const buildUserQueryParams_1 = require("../../../Utils/buildUserQueryParams");
const prisma = new client_1.PrismaClient();
const getAllUser = (user, queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const adminDetails = yield prisma.user.findFirst({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
            role: user === null || user === void 0 ? void 0 : user.role,
        },
    });
    if (!adminDetails) {
        throw new APIError_1.default(404, "Admin not found!");
    }
    // Ensure queryParams is always an object
    queryParams = queryParams || {};
    const { where, pageNumber, limitNumber, sortBy, sortOrder } = (0, buildUserQueryParams_1.buildUserQueryParams)(queryParams);
    const [users, totalCount] = yield Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                userProfile: true,
            },
            orderBy: sortBy
                ? {
                    [sortBy]: sortOrder || "desc",
                }
                : { email: "asc" },
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
        }),
        prisma.user.count({ where }),
    ]);
    const defaultProfileImage = "https://res.cloudinary.com/dmr810p4l/image/upload/v1717297396/2150771125_osnw4b.jpg";
    const modifiedUsers = users.map((user) => {
        var _a;
        return Object.assign(Object.assign({}, user), { userProfile: Object.assign(Object.assign({}, user.userProfile), { profileImage: ((_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.profileImage) || defaultProfileImage }) });
    });
    return {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User info update successfully!",
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total: totalCount,
        },
        data: modifiedUsers,
    };
});
/* const getAllUser = async (user: any, queryParams: any) => {
    const adminDetails = await prisma.user.findFirst({
        where: {
            id: user?.id,
            role: user?.role,
        },
    });

    if (!adminDetails) {
        throw new APIError(404, "Admin not found!");
    }

    // Ensure queryParams is always an object
    queryParams = queryParams || {};

    const { where, pageNumber, limitNumber, sortBy, sortOrder } =
        buildUserQueryParams(queryParams);

    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                userProfile: true,
            },
            orderBy: sortBy
                ? {
                        [sortBy]: sortOrder || "desc",
                  }
                : { email: "asc" },
            take: limitNumber,
            skip: (pageNumber - 1) * limitNumber,
        }),
        prisma.user.count({ where }),
    ]);

    return {
        success: true,
        statusCode: httpStatus.OK,
        message: "User info update successfully!",
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total: totalCount,
        },
        data: users,
    };
}; */
const updateUserInfo = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma.user.findFirstOrThrow({
        where: {
            id: userId,
        },
    });
    if (!userInfo) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, "User does not exists!");
    }
    const result = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: status,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
    return result;
});
const updateUserRole = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!isUserExist) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, "User does not exists!");
    }
    const result = yield prisma.user.update({
        where: {
            id: userId,
        },
        data: role,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
    return result;
});
const getDashboardData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const adminDetails = yield prisma.user.findFirst({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
            role: user === null || user === void 0 ? void 0 : user.role,
        },
    });
    if (!adminDetails) {
        throw new APIError_1.default(404, "Admin is not found....!!");
    }
    const totalTrip = yield prisma.trip.count({});
    const totalUser = yield prisma.user.count({});
    const totalActiveUser = yield prisma.user.count({
        where: {
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const totalDeActiveUser = yield prisma.user.count({
        where: {
            status: client_1.UserStatus.DEACTIVE,
        },
    });
    const totalTripRequest = yield prisma.travelBuddyRequest.count({});
    const totalTripRequestPending = yield prisma.travelBuddyRequest.count({
        where: {
            status: client_1.TravelBuddyStatus.PENDING,
        },
    });
    const totalTripRequestApproved = yield prisma.travelBuddyRequest.count({
        where: {
            status: client_1.TravelBuddyStatus.APPROVED,
        },
    });
    const totalTripRequestRejected = yield prisma.travelBuddyRequest.count({
        where: {
            status: client_1.TravelBuddyStatus.REJECTED,
        },
    });
    return {
        totalTrip,
        totalUser,
        totalActiveUser,
        totalDeActiveUser,
        totalTripRequest,
        totalTripRequestPending,
        totalTripRequestApproved,
        totalTripRequestRejected,
    };
});
exports.userService = {
    getAllUser,
    updateUserInfo,
    updateUserRole,
    getDashboardData,
};
