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
const prisma = new client_1.PrismaClient();
const getAllUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const adminDetails = yield prisma.user.findFirst({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
            role: user === null || user === void 0 ? void 0 : user.role,
        },
    });
    if (!adminDetails) {
        throw new APIError_1.default(404, "Admin is not found!");
    }
    const result = yield prisma.user.findMany({
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
exports.userService = {
    getAllUser,
    updateUserInfo,
    updateUserRole,
};
